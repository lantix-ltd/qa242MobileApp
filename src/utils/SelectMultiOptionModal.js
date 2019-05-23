
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { CheckBox } from 'react-native-elements'
import { appGreyColor, appPinkColor } from "./AppStyles";

class SelectMultiOptionModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            selectedProgramtypes: null,
        }
    }

    render() {
        return (
            <Modal
                isVisible={this.state.modalVisible}
                onBackdropPress={() => { }}
                onBackButtonPress={() => { }}
            >
                <View style={styles.container}>
                    {this.state.selectedProgramtypes != null &&
                        this.state.selectedProgramtypes.map((item, index) => {
                            return (
                                <View key={index}>
                                    <CheckBox
                                        containerStyle={{ flex: 1, padding: 15 }}
                                        title={item.key}
                                        textStyle={{ fontSize: 18, color: appGreyColor }}
                                        checked={item.isSelecetd}
                                        onPress={() => { this.handleOptionClick(item) }}
                                    />
                                    <View style={{ backgroundColor: "#ccc", height: 1, marginHorizontal: 10 }} />
                                </View>
                            )
                        })
                    }
                    <View style={{ flexDirection: "row", padding: 10, justifyContent: "flex-end", alignItems: "flex-end" }}>
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => {
                            this.onCancel()
                            this.props.onDonePress(this.state.selectedProgramtypes)
                        }}>
                            <Text style={{ fontSize: 18, color: appPinkColor }}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    handleOptionClick(item) {
        let options = [...this.state.selectedProgramtypes]
        let indx = options.findIndex(item2 => item2.id == item.id)
        if (indx != undefined && indx > -1) {
            var opt = options[indx]
            opt.isSelecetd = !opt.isSelecetd
            options[indx] = opt
        }
        this.setState({ selectedProgramtypes: options })
    }

    showProgramsTypes(_selectedProgramtypes) {
        this.setState({ selectedProgramtypes: _selectedProgramtypes })
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
        backgroundColor: 'white'
    }
});

export default SelectMultiOptionModal;