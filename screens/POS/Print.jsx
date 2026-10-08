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
import { Text, BottomSheet, Inline, Button, COLORS } from 'ripal-ui';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import LocalStore from '../../lib/LocalStore';
import Currency from '../../lib/Currency';

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

	const ensurePrinterReady = async () => {
		if (!BLEPrinter || typeof BLEPrinter.init !== 'function') {
			throw new Error('Bluetooth printer library not available');
		}

		if (!printerReadyRef.current) {
			await BLEPrinter.init();
			printerReadyRef.current = true;
		}
	};

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
			// let def = await AsyncStorage.getItem('auto_print');
			let def = await LocalStore.getItem('auto_print');
			// setAutoPrint(JSON.parse(def));
			setAutoPrint(def);
		}

		getAutoPrint();
	}, []);

	useEffect(() => {
		if (defaultPrinter !== "init" && autoPrint !== "init") {
			scanDevices();
		}
	}, [defaultPrinter, autoPrint]);

	const requestBluetoothPermissions = async () => {
		if (Platform.OS === 'android' && Platform.Version >= 31) {
			await PermissionsAndroid.requestMultiple([
				PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
				PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			]);
		}
	};

	useEffect(() => {
		(async () => {
			await requestBluetoothPermissions();
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
			await ensurePrinterReady();
			const devices = await BLEPrinter.getDeviceList();
			setFoundDevices(devices || []);
			devices.map((dev, d) => {
				if (dev.inner_mac_address === defaultPrinter) {
					connectDevice(dev);
				}
			})
		} catch (e) {
			console.warn('Scan failed', e);
			ToastAndroid.show('Scan failed', ToastAndroid.SHORT);
		}
		setLoading(false);
	};

	useEffect(() => {
		console.log('effext');

		if (autoPrint === true && boundAddress) {
			console.log('effext');
			console.log('autoprint', autoPrint);
			console.log('addr', boundAddress);
			
			printStruk();
		}
	}, [autoPrint, boundAddress, connectedRef]);

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

			let receipt = centerText(`Nasi Goreng Master - ${branchName}`);
			receipt += `${centerText(branchAddress)}\n`;
			receipt += `--------------------------------\n`;
			receipt += `No. \t  : ${invoice}\n`;
			receipt += `Staf      : ${staffName}\n`;
			receipt += `Pelanggan : ${customerName}\n\n`;
			receipt += centerText(createdAt) + '\n';

			// send header with timeout guard
			await withTimeout(safePrint(receipt), 10000);

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
			footer += `\n\n\n`;

			await withTimeout(safePrint(footer), 10000);

			// try to close connection (best-effort)
			try {
				if (BLEPrinter.closeConn) {
					await withTimeout(BLEPrinter.closeConn(), 5000);
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
		<BottomSheet visible={isPrinting} onClose={() => setPrinting(false)}>
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
		</BottomSheet>
	);
};

const styles = StyleSheet.create({
	list_area: {
		marginVertical: 15,
		gap: 18
	}
});

export default POSPrint;
