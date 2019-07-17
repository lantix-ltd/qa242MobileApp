
import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import MyUtils from "../../utils/MyUtils";
import { primaryColor } from "../../utils/AppStyles";
import { DrawerActions } from 'react-navigation';
import PrefManager from "../../data/local/PrefManager"

const prefManager = new PrefManager()
const WAREHOUSE = "warehouse", PRODUCTION = "production", PACKING_TECH = "packingtech"

class InputForms extends Component {

    constructor(props) {
        super(props)
        this.state = {
            inputForms: [],
            isLoading: false, refreshing: false, isError: false, errorMsg: "",
        }
    }

    handleToggle() {
        this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    }

    componentDidMount() {
        var forms = [
            { id: 1, title: "Receiving Inspection Log", value: "FormNo1", responsible: WAREHOUSE },
            { id: 2, title: "PPC-7 Shipping Inspection", value: "FormNo2", responsible: WAREHOUSE },
            { id: 3, title: "Palletizing Record", value: "FormNo3", responsible: PRODUCTION },
            { id: 4, title: "PPC-2 Cleaning Inspection", value: "FormNo4", responsible: PACKING_TECH },
            { id: 5, title: "Bulk Pasta Temp Log (Every Tub)", value: "FormNo5", responsible: PRODUCTION },
            { id: 6, title: "Repack/ Recode Form", value: "FormNo6", responsible: PACKING_TECH },
            { id: 7, title: "Bulk Pasta Temp Log (Every Bulk Form)", value: "FormNo7", responsible: PRODUCTION },
        ]
        this.setState({ isLoading: true })
        prefManager.getUserSessionData(data => {
            if (data != null) {
                let pr = data.userPrimaryType
                let sr = data.userSecondaryType
                let resp = ""
                if (pr == WAREHOUSE || sr == WAREHOUSE) {
                    resp = WAREHOUSE
                } else if (pr == PRODUCTION || sr == PRODUCTION) {
                    resp = PRODUCTION
                } else if (pr == PACKING_TECH || sr == PACKING_TECH) {
                    resp = PACKING_TECH
                }
                let respForms = []
                forms.map((item, index) => {
                    if (item.responsible == resp) {
                        respForms.push(item)
                    }
                })
                this.setState({ inputForms: respForms, isLoading: false })
            } else {
                this.setState({ inputForms: null, isLoading: false })
            }
        })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={{ padding: 5, height: 60, flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: primaryColor }}>
                        <TouchableOpacity
                            style={{ padding: 10, }}
                            onPress={() => this.handleToggle()}>
                            <Icon name="menu" size={20} color={"#fff"} />
                        </TouchableOpacity>
                        <Text
                            style={{ color: "#fff", fontSize: 16, marginLeft: 10, }}>
                            {MyUtils.APP_NAME}
                        </Text>
                        <View style={{ flex: 1 }} />
                    </View>
                    {this.state.isLoading && MyUtils.renderLoadingView()}
                    {(!this.state.isLoading && !this.state.isError) &&
                        <View style={[styles.container]}>
                            {!MyUtils.isEmptyArray(this.state.inputForms) &&
                                <FlatList
                                    style={{ flex: 1 }}
                                    data={this.state.inputForms}
                                    renderItem={({ item, index }) => this.renderItem(item, index)}
                                    keyExtractor={(item, index) => index.toString()}
                                // onRefresh={() => this.handleRefresh()}
                                // refreshing={this.state.refreshing}
                                // onEndReached={() => this.handleLoadMore()}
                                // onEndReachedThreshold={0.5}
                                />
                            }
                            {MyUtils.isEmptyArray(this.state.inputForms) &&
                                <View style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    <Text style={{ alignSelf: "center", fontSize: 16 }}>No forms for you</Text>
                                </View>
                            }
                        </View>
                    }
                </View>
            </SafeAreaView>
        );
    }

    renderItem(item, index) {
        return (
            <View style={[styles.round_white_bg, { padding: 10, margin: 10, }]}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate(item.value)}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ alignSelf: "center", fontSize: 17, fontWeight: "bold", marginEnd: 10 }}>
                            {("0" + (index + 1)).slice(-2)}.
                            </Text>
                        <Text style={{ fontSize: 17 }}> {item.title}</Text>
                    </View>

                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    round_white_bg: {
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        borderRadius: 10
    }
});

export default InputForms;