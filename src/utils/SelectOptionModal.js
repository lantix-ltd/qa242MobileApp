
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Feather'
import { appGreyColor } from "./AppStyles";
import MyUtils from "./MyUtils";

class SelectOptionModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            options: []
        }
    }

    render() {
        return (
            <Modal
                isVisible={this.state.modalVisible}
                onBackdropPress={() => this.setState({ modalVisible: false })}
                onBackButtonPress={() => this.setState({ modalVisible: false })}
            >
                <View style={styles.container}>
                    {!MyUtils.isEmptyArray(this.state.options) &&
                        this.state.options.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => this.handleOptionClick(item.type)}>
                                    <View style={{ paddingHorizontal: 15, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                        {!MyUtils.isEmptyString(item.icon) && <Icon name={item.icon} size={24} color={appGreyColor} />}
                                        <Text style={{ fontSize: 20, paddingVertical: 10, paddingHorizontal: 15 }}>{item.key}</Text>
                                    </View>
                                    <View style={{ backgroundColor: "#ccc", height: 1, marginHorizontal: 10 }} />
                                </TouchableOpacity>
                            )
                        })
                    }
                    {/* {MyUtils.isEmptyArray(this.state.options) && this.onCancel()} */}
                </View>
            </Modal>
        );
    }

    handleOptionClick(type) {
        this.props.onItemPress(type)
        this.onCancel()
    }

    setModalVisible(options) {
        this.setState({ options, modalVisible: true });
    }

    onCancel() {
        this.setModalVisible(false)
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    }
});

export default SelectOptionModal;