
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
                                <View style={styles.round_white_bg_container} key={index}>
                                    <CheckBox
                                        containerStyle={{ flex: 1, padding: 15 }}
                                        title={item.key}
                                        textStyle={{ fontSize: 18, color: appGreyColor }}
                                        checked={item.isSelecetd}
                                        onPress={() => { this.handleOptionClick(item) }}
                                    />
                                </View>
                            )
                        })
                    }
                    <View style={{ flexDirection: "row", padding: 10 }}>
                        <TouchableOpacity style={[styles.round_pink_btn_bg, { flex: 1, height: 40, justifyContent: "center" }]} onPress={() => {
                            this.onCancel()
                            this.props.onDonePress(this.state.selectedProgramtypes)
                        }}>
                            <Text style={{ textAlign: "center", fontSize: 17, fontWeight: "bold", color: "#fff" }}>Save</Text>
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
    },
    round_white_bg_container: {
        backgroundColor: '#fff',
        margin: 7,
        borderRadius: 5
    },
    round_pink_btn_bg: {
        backgroundColor: '#F75473',
        overflow: 'hidden',
        borderRadius: 5
    }
});

export default SelectMultiOptionModal;