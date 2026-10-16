import React, { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Platform,
	StyleSheet,
	View,
	PermissionsAndroid,
	Dimensions,
	ToastAndroid
} from 'react-native';
import {
	BLEPrinter
} from 'react-native-thermal-receipt-printer-image-qr';
import { Text, BottomSheet, Inline, Button, COLORS, Dialog } from 'ripal-ui';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import LocalStore from '../../lib/LocalStore';
import Currency from '../../lib/Currency';
import config from '../../config';

const { width } = Dimensions.get('window');

const POSPrint = ({ sales, isPrinting, setPrinting }) => {
	const [foundDevices, setFoundDevices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [boundAddress, setBoundAddress] = useState('');
	const [name, setName] = useState('');
	const [printingNow, setPrintingNow] = useState(false);
	const [defaultPrinter, setDefaultPrinter] = useState('init');
	const [autoPrint, setAutoPrint] = useState('init');
	const connectedRef = useRef(null);
	const printerReadyRef = useRef(false);

	useEffect(() => {
		const getDefaultPrinter = async () => {
			// let def = await AsyncStorage.getItem('default_printer');
			let def = await LocalStore.getItem('default_printer');
			setDefaultPrinter(def);
		}

		getDefaultPrinter();
	}, []);

	useEffect(() => {
		const getAutoPrint = async () => {
			const def = await LocalStore.getItem('auto_print');
			setAutoPrint(def === true || def === 'true');
		};

		getAutoPrint();
	}, []);

	useEffect(() => {
		if (defaultPrinter !== "init" && autoPrint !== "init") {
			scanDevices();
		}
	}, [defaultPrinter, autoPrint]);

	const requestBluetoothPermissions = async () => {
		if (Platform.OS !== 'android') {
			return true;
		}

		if (Platform.Version < 23) {
			return true;
		}

		const permissions = Platform.Version >= 31
			? [
				PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
				PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
			]
			: [
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			];

		try {
			const results = await PermissionsAndroid.requestMultiple(permissions);

			console.log('[Printer] Permission results:', results);

			const permanentlyDenied = permissions.some(
				permission =>
					results[permission] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
			);

			if (permanentlyDenied) {
				ToastAndroid.show(
					'Enable Nearby devices permission in app settings',
					ToastAndroid.LONG
				);
				return false;
			}

			return permissions.every(
				permission =>
					results[permission] === PermissionsAndroid.RESULTS.GRANTED
			);
		} catch (error) {
			console.warn('[Printer] Permission request failed:', error);
			return false;
		}
	};

	const ensurePrinterReady = async () => {
		if (!BLEPrinter || typeof BLEPrinter.init !== 'function') {
			throw new Error('Bluetooth printer library not available');
		}

		// Always request/check permission before accessing native Bluetooth APIs.
		const hasPermission = await requestBluetoothPermissions();

		if (!hasPermission) {
			throw new Error('Bluetooth permissions denied');
		}

		if (!printerReadyRef.current) {
			await BLEPrinter.init();
			printerReadyRef.current = true;
		}
	};

	useEffect(() => {
		(async () => {
			try {
				await ensurePrinterReady();
			} catch (e) {
				console.warn('Failed to init printer', e);
				ToastAndroid.show('Failed to init printer', ToastAndroid.SHORT);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const delay = ms => new Promise(res => setTimeout(res, ms));

	const withTimeout = (promiseOrValue, ms = 10000) => {
		const p = (promiseOrValue instanceof Promise) ? promiseOrValue : Promise.resolve(promiseOrValue);
		return Promise.race([
			p,
			new Promise((_, rej) => setTimeout(() => rej(new Error('operation timeout')), ms))
		]);
	};

		
	const scanDevices = async () => {
		setName('');
		setLoading(true);

		try {
			console.log('[Printer] 1. Scan started');

			const hasPermission = await requestBluetoothPermissions();

			if (!hasPermission) {
				console.warn('[Printer] Bluetooth permission denied');
				ToastAndroid.show(
					'Bluetooth permission is required',
					ToastAndroid.LONG
				);
				return;
			}

			console.log('[Printer] Bluetooth permissions granted');

			await ensurePrinterReady();
			console.log('[Printer] 2. Printer ready');

			const devices = await BLEPrinter.getDeviceList();
			console.log('[Printer] 3. Devices:', devices);
			console.log('[Printer] 4. Default printer:', defaultPrinter);

			const foundDevices = devices || [];
			setFoundDevices(foundDevices);

			foundDevices.forEach((dev) => {
				console.log('[Printer] Device:', dev);
				console.log(
					'[Printer] MAC:',
					dev.inner_mac_address,
					'Expected:',
					defaultPrinter
				);

				if (dev.inner_mac_address === defaultPrinter) {
					console.log('[Printer] Matching printer found');
					connectDevice(dev);
				}
			});
		} catch (e) {
			console.warn('[Printer] Scan failed:', e);
			ToastAndroid.show(
				e.message || 'Scan failed',
				ToastAndroid.SHORT
			);
		} finally {
			setLoading(false);
			console.log('[Printer] 5. Scan finished');
		}
	};


	useEffect(() => {
		console.log('effext', {
			autoPrint,
			autoPrintType: typeof autoPrint,
			boundAddress,
		});

		if (autoPrint === true && boundAddress) {
			console.log('effext2');
			printStruk();
		}
	}, [autoPrint, boundAddress]);

	const connectDevice = async (device) => {
		setLoading(true);
		try {
			await ensurePrinterReady();
			await BLEPrinter.connectPrinter(device.inner_mac_address);
			setBoundAddress(device.inner_mac_address);
			setName(device.device_name || 'UNKNOWN');
			setFoundDevices([]);
			// await AsyncStorage.setItem('default_printer', device.inner_mac_address);
			await LocalStore.setItem('default_printer', device.inner_mac_address);

			if (autoPrint === true) {
				setTimeout(() => {
					printStruk();
				}, 500);
			}
		} catch (e) {
			alert('Connection failed: ' + (e.message || JSON.stringify(e)));
		}
		setLoading(false);
	};

	const printStruk = async () => {
		console.log('printing');

		try {
			await ensurePrinterReady();
		} catch (e) {
			ToastAndroid.show('Printer is not ready', ToastAndroid.SHORT);
			return;
		}
		
		// Prevent duplicate prints
		if (printingNow) {
			console.warn('Already printing');
			return;
		}

		// Basic validation of sales object to avoid undefined access
		if (!sales || !Array.isArray(sales.items)) {
			ToastAndroid.show('No sales data to print', ToastAndroid.SHORT);
			return;
		}

		// Ensure device connected
		if (!boundAddress) {
			// console.log('ref', connectedRef.current);
			// console.log('addr', boundAddress);
			
			
			console.log('no printer');
			
			ToastAndroid.show('No printer connected', ToastAndroid.SHORT);
			return;
		}
		console.log('c');

		setPrintingNow(true);

		try {
			// Build receipt defensively
			const branchName = sales.branch?.name ?? 'Toko';
			const branchAddress = sales.branch?.address ?? '';
			const invoice = sales.invoice_number ?? '-';
			const staffName = sales.user?.name ?? '-';
			const customerName = sales.customer?.name ?? '-';
			const createdAt = sales.created_at ? dayjs(sales.created_at).format('DD MMM YYYY - HH:mm:ss') : '';
			
			let receipt = centerText(`${sales.store.name}`);
			receipt += `${centerText(branchAddress)}\n`;
			receipt += `${centerText(invoice)}\n`;
			receipt += `--------------------------------\n`;
			receipt += `Staf : ${staffName}\n`;
			receipt += `Cust : ${customerName}\n\n`;
			receipt += centerText(createdAt) + '\n';

			// send header with timeout guard
			await withTimeout(safePrint(receipt), 2000);

			for (const item of sales.items) {
				const productName = item.product?.name || 'Unknown Product';
				const price = Currency(item.price ?? 0).encode();
				const qty = item.quantity ?? 0;
				const total = Currency(item.total_price ?? 0).encode();

				let itemText = `${productName}\n`;
				itemText += `${qty} x ${price} = ${total}\n`;

				if (Array.isArray(item.addons) && item.addons.length) {
					for (const addon of item.addons) {
						const addonName = addon.addon?.name || 'Addon';
						const addonPrice = Currency(addon.price ?? 0).encode();
						const addonQty = addon.quantity ?? 0;
						const addonTotal = Currency(addon.total_price ?? 0).encode();
						itemText += `+ ${addonName}\n`;
						itemText += `  ${addonQty} x ${addonPrice} = ${addonTotal}\n`;
					}
				}

				await withTimeout(safePrint(itemText), 10000);
				await delay(150);
			}

			let footer = `--------------------------------\n`;
			footer += `Total Qty : ${sales.total_quantity ?? 0}\n`;
			footer += `Total     : ${Currency(sales.total_price ?? 0).encode()}\n`;

			await withTimeout(safePrint(footer), 2000);

			const qrString = `${config.base_url}/receipt/${encodeURIComponent(invoice)}?customer_id=${sales.customer_id}`;
			const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrString)}&size=200x200&ecc=M&margin=4`;

			if (typeof BLEPrinter.printImage === 'function') {
				BLEPrinter.printImage(qrImageUrl, {
					imageWidth: 200,
					paddingX: 0,
				});

				// Allow time for image processing and Bluetooth transmission.
				await delay(3000);

				// Feed paper only after giving the image time to print.
				await withTimeout(safePrint('\n\n'), 500);
				await delay(500);
			} else {
				console.warn('[Printer] printImage is not available');
			}

			// try to close connection (best-effort)
			try {
				if (BLEPrinter.closeConn) {
					await withTimeout(BLEPrinter.closeConn(), 1000);
				}
			} catch (e) {
				console.warn('Failed to close connection', e);
			} finally {
				connectedRef.current = false;
			}

			// close bottom sheet
			setPrinting(false);
		} catch (err) {
			console.warn('Print failed', err);
			ToastAndroid.show('Print failed', ToastAndroid.SHORT);
		} finally {
			setPrintingNow(false);
		}
	};

		const safePrint = (text) => new Promise((resolve, reject) => {
		try {
			// some BLE libs return void, some promise; wrap both
			const result = BLEPrinter.printText && BLEPrinter.printText(text);
			// if result is a promise, await it, otherwise resolve immediately
			if (result instanceof Promise) {
				result.then(resolve).catch(reject);
			} else {
				// small tick to avoid blocking
				setTimeout(resolve, 0);
			}
		} catch (e) {
			reject(e);
		}
	});

	const lineWidth = 32;

	const padLine = (text = '') => {
		if (typeof text !== 'string') text = String(text ?? '');
		if (text.length > lineWidth) return text.slice(0, lineWidth);
		return text.padEnd(lineWidth, ' ');
	};

	const printLine = async (text) => {
		await safePrint(padLine(text) + '\n');
	};

	const centerText = (text, width = 32) => {
		const trimmed = String(text ?? '').trim();
		const leftPadding = Math.floor((width - trimmed.length) / 2);
		return ' '.repeat(leftPadding > 0 ? leftPadding : 0) + trimmed;
	};

	return (
		<Dialog visible={isPrinting} onClose={() => setPrinting(false)}>
			<Dialog.Title>Print Struk</Dialog.Title>
			<Dialog.Body>
				{
					autoPrint === true ?
					<Inline justifyContent='center'>
						<ActivityIndicator size={32} />
					</Inline>
					:
					<>
					<Inline justifyContent="flex-end">
						<Inline style={{ flexGrow: 1 }}>
							<Ionicons name="print-outline" color={COLORS.slate[700]} size={32} />
							<Text size={12}>{name === '' ? 'Belum Terhubung' : name}</Text>
						</Inline>
						{loading ? (
							<ActivityIndicator />
						) : (
							<Inline gap={10} onPress={scanDevices} style={{padding: 8}}>
								<Ionicons name="sync-outline" />
								<Text size={11}>Scan</Text>
							</Inline>
						)}
					</Inline>

					{
						autoPrint !== true &&
						<View style={styles.list_area}>
							{foundDevices?.map((device, d) => {
								if (device.device_name) {
									return (
										<Inline key={d} onPress={() => connectDevice(device)}>
											<Text
												style={{ flexGrow: 1 }}
												weight="600SemiBold"
												color={COLORS.slate[700]}
											>
												{device.device_name || 'Tanpa Nama'}
											</Text>
											<Text size={11}>{device.inner_mac_address}</Text>
										</Inline>
									);
								}
								return null;
							})}
						</View>
					}

					{(name !== '') && (
						<Button onPress={printStruk}>
							Print Struk
						</Button>
					)}
					</>
				}
			</Dialog.Body>
		</Dialog>
	);
};

const styles = StyleSheet.create({
	list_area: {
		// marginVertical: 15,
		gap: 18
	}
});

export default POSPrint;
