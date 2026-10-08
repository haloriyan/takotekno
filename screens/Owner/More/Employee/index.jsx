import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, COLORS, Dialog, Inline, Text } from "ripal-ui";
import useUser from "../../../../hooks/useUser";
import axios from "axios";
import config from "../../../../config";
import { KeyboardAwareScrollView as ScrollView } from "react-native-keyboard-aware-scroll-view";
import Initial from "../../../../lib/Initial";
import { Ionicons } from "@expo/vector-icons";
import OwnerMoreEmployeeAdd from "./Add";
import EmptyImage from "../../../../assets/no_employee.png";
import OwnerMoreEmployeeRole from "./Role";

const Item = ({ employ, setContextMenu }) => {

    return (
        <Inline gap={15}>
            <Button circle color={employ.user.color}>
                <Text color="#fff" style={{ fontWeight: '700' }}>{Initial(employ.user.name)}</Text>
            </Button>
            <View style={{ flexGrow: 1,flexBasis: 100,gap: 5,flexShrink: 1 }}>
                <Text color={COLORS.slate[800]} style={{ fontWeight: '600' }}>{employ.user.name}</Text>
                <Text size={10}>{employ.role.toUpperCase()}</Text>
            </View>
            <Button circle accent="tertiary" onPress={(event) => {
                const { locationX, locationY, pageY } = event.nativeEvent;
                setContextMenu({top: pageY, employee: employ });
            }} style={{
                borderWidth: 1,
                borderColor: '#ddd'
            }}>
                <Ionicons name="ellipsis-horizontal-outline" color={COLORS.slate[800]} />
            </Button>
        </Inline>
    )
}

const OwnerMoreEmployee = ({ navigation, route }) => {
    const [user] = useUser();
    const [contextMenu, setContextMenu] = useState(null);
    const [isAdding, setAdding] = useState(false);
    const [canAdd, setCanAdd] = useState(false);

    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [raw, setRaw] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [role, setRole] = useState(null);

    const [isDeleting, setDeleting] = useState(false);
    const [isDeletingProc, setDeletingProc] = useState(false);
    const [isRoling, setRoling] = useState(false);
    const [isRolingProc, setRolingProc] = useState(false);

    useEffect(() => {
        if (canAdd) {
            navigation.setOptions({
                headerRight: () => (
                    <Button circle onPress={() => setAdding(true)}>
                        <Ionicons name="add" color={'#fff'} size={20} />
                    </Button>
                )
            });
        }
    }, [canAdd]);

    const load = async (thePage = 1) => {
        if (isLoading) return;

        setLoading(true);
        try {
            const response = await axios.get(`${config.base_url}/api/store/employee?page=${thePage}&role=${role}`, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            let res = response.data;

            setRaw(res.employees);
            setEmployees(prev => [...prev, ...res.employees.data]);
            setCanAdd(res.can_add);
            
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user !== null) {
            setRaw(null);
            setEmployees([]);
            load();
        }
    }, [user, page, role]);

    const del = async () => {
        if (isDeletingProc) return;

        setDeletingProc(true);

        try {
            const response = await axios.post(`${config.base_url}/api/store/employee/delete`, {
                user_id: contextMenu?.employee.user.id,
                store_id: user?.access?.store_id,
            }, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });

            setEmployees([]);
            setPage(1);
            load();

            setDeleting(false);
            setContextMenu(null);
        } catch (err) {
            console.error(err);
            console.error(err?.response?.data);
        } finally {
            setDeletingProc(false);
        }
    }

    return (
        <>
            <View style={{ maxHeight: 60 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: "#fff",paddingVertical: 15,maxHeight: 60 }} contentContainerStyle={{ gap: 10,height: 32 }}>
                    <View /><View />
                    <TouchableOpacity onPress={() => setRole(null)} style={[styles.chip, role === null ? styles.chip_active : null]}>
                        <Text size={12} color={role === null ? COLORS.primary : COLORS.slate[500]} style={{ fontWeight: role === null ? '600' : '400' }}>Semua</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setRole('cashier')} style={[styles.chip, role === 'cashier' ? styles.chip_active : null]}>
                        <Text size={12} color={role === 'cashier' ? COLORS.primary : COLORS.slate[500]} style={{ fontWeight: role === 'cashier' ? '600' : '400' }}>Kasir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setRole('stockist')} style={[styles.chip, role === 'stockist' ? styles.chip_active : null]}>
                        <Text size={12} color={role === 'stockist' ? COLORS.primary : COLORS.slate[500]} style={{ fontWeight: role === 'stockist' ? '600' : '400' }}>Staf Gudang</Text>
                    </TouchableOpacity>
                    <View /><View />
                </ScrollView>
            </View>
            <ScrollView contentContainerStyle={styles.container} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={async () => {
                    setEmployees([]);
                    setPage(1);
                    await load(1);
                }} />
            } scrollEventThrottle={16} onScroll={e => {
                setContextMenu(null);
            }}>
                {
                    employees.length === 0 ?
                    <>
                    { isLoading ?
                        <></>
                        :
                        <View style={{alignItems: 'center', gap: 10}}>
                            <Image source={EmptyImage} style={{ width: 300,height: 300 }} />
                            <Text size={20} color={COLORS.slate[800]} style={{ fontWeight: '600' }}>Belum ada data.</Text>
                            <View /><View />
                            <Button onPress={() => setAdding(true)}>Tambahkan</Button>
                        </View>
                    }
                    </>
                    :
                    <View style={{ gap: 20 }}>
                        { employees.map((employ, e) => (
                            <Item 
                                key={e} employ={employ} 
                                setContextMenu={setContextMenu}
                            />
                        ))}
                    </View>
                }
            </ScrollView>

            { contextMenu !== null &&
                <View style={{...styles.context, top: (contextMenu.top - 135) }}>
                    <Inline style={styles.context_item} gap={10} onPress={() => {
                        setRoling(true);
                    }}>
                        <Ionicons name="lock-closed-outline" color={COLORS.primary} />
                        <Text size={12} color={COLORS.slate[700]} style={{ fontWeight: '500' }}>Ubah Peran</Text>
                    </Inline>
                    <View style={{ height: 0.5,backgroundColor: COLORS.slate[200]}} />
                    <Inline style={styles.context_item} gap={10} onPress={() => {
                        setDeleting(true);
                    }}>
                        <Ionicons name="lock-closed-outline" color={COLORS.red[500]} />
                        <Text size={12} color={COLORS.red[500]} style={{ fontWeight: '500' }}>Hapus</Text>
                    </Inline>
                </View>
            }

            { isAdding &&
                <>
                <OwnerMoreEmployeeAdd 
                    isAdding={isAdding} setAdding={setAdding}
                    user={user} onSuccess={res => {
                        setEmployees([]);
                        setPage(1);
                        load();

                        setAdding(false);
                    }}
                />
                </>
            }

            { (isDeleting && contextMenu !== null) &&
                <Dialog visible={isDeleting} onClose={() => {
                    setDeleting(false);
                    setContextMenu(null);
                }}>
                    <Dialog.Title>Hapus Karyawan?</Dialog.Title>
                    <Dialog.Body>
                        <Text>
                            Tindakan ini akan menghapus akses {contextMenu.employee.user?.name} dari {user?.access.store.name}.
                        </Text>
                    </Dialog.Body>
                    <Dialog.Actions>
                        <Button color={COLORS.slate[200]} onPress={() => {
                            setDeleting(false);
                            setContextMenu(null);
                        }}>
                            <Text color={COLORS.slate[700]} style={{ fontWeight: '600' }}>Batal</Text>
                        </Button>
                        <Button color={COLORS.red[500]} onPress={() => del()}>
                            { isDeletingProc ?
                                <ActivityIndicator color={'#fff'} size={12} />
                            :
                                <Text color="#fff" style={{ fontWeight: '600' }}>Hapus</Text>
                            }
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            }
            { (isRoling && contextMenu !== null) &&
                <>
                <OwnerMoreEmployeeRole 
                    user={user} isRoling={isRoling} setRoling={setRoling}
                    access={contextMenu.employee}
                    onSuccess={res => {
                        setEmployees([]);
                        setPage(1);
                        load();

                        setRoling(false);
                    }}
                />
                </>
            }

            {
                !canAdd &&
                <Inline style={[styles.bottom, styles.shadow]} gap={10}>
                    <View style={{ flexGrow: 1,flexShrink: 1,flexBasis: 100,gap: 5 }}>
                        <Text size={12} style={{ fontWeight: '700' }}>Upgrade untuk Lebih Banyak.</Text>
                        { user?.access?.store?.package === 'starter' ?
                            <Text size={11}>Tingkatkan ke PRO untuk menambahkan karyawan tanpa batas.</Text>
                            :
                            <Text size={11}>Tingkatkan ke STARTER atau PRO untuk menambahkan karyawan.</Text>
                        }
                    </View>
                    <Button onPress={() => navigation.navigate('Upgrade')}>
                        <Text size={11} color="#fff" style={{ fontWeight: '700' }}>Upgrade</Text>
                    </Button>
                </Inline>
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
        flexGrow: 1,
        gap: 20,
    },
    chip: {
        backgroundColor: "#fff",
        padding: 6,
        paddingHorizontal: 15,
        borderRadius: 99,
        borderWidth: 1,
        borderColor: "#ddd",
        alignItems: 'center',
        justifyContent: 'center'
    },
    chip_active: {
        borderColor: COLORS.primary,
    },
    shadow: {
        shadowColor: '#ddd',
        shadowOffset: { width: 1, height: 1, },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
    context: {
        position: 'absolute',
        right: 20,
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingVertical: 15,
        gap: 10,
        borderWidth: 1,
        borderColor: COLORS.slate[300]
    },
    context_item: {
        padding: 5,
        paddingHorizontal: 10,
    },
    bottom: {
        position: 'absolute',
        bottom: 20,left: 20,right: 20,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
    }
});

export default OwnerMoreEmployee;