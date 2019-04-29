
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { RadioButton } from "react-native-paper"
import Icon from 'react-native-vector-icons/Feather'
import { appPinkColor } from "./AppStyles";

class MyValuePicker extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            options: props.options,
            selectedVal: props.selectedVal
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
                    <RadioButton.Group
                        onValueChange={value => this.handleOptionClick(value)}
                        value={this.state.selectedVal}
                    >
                        {this.state.options.map((item, index) => {
                            return (
                                <TouchableOpacity style={{ flex: 1 }} key={index} onPress={() => this.handleOptionClick(item.id)}>
                                    <View
                                        style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", paddingHorizontal: 10 }}>
                                        <Text style={{ flex: 1, fontSize: 18 }}>{item.title}</Text>
                                        <RadioButton color={appPinkColor} value={item.id} />
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </RadioButton.Group>
                </View>
            </Modal>
        );
    }

    handleOptionClick(id) {
        var options = this.state.options
        var indx = options.findIndex(item => item.id == id)
        var my_opt = options[indx]

        this.onCancel()
        this.props.onItemPress(my_opt)
    }

    showMyPicker(selectedVal) {
        this.setState({ selectedVal: selectedVal })
        this.setModalVisible(true)
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    onCancel() {
        this.setModalVisible(false)
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: 200,
        justifyContent: "center",
    }
});

export default MyValuePicker;