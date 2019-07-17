
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Feather'
import { appGreyColor } from "./AppStyles";

const options = [
    { id: 1, key: "Take a photo", icon: "camera", type: "photo" },
    { id: 2, key: "Open Gallery", icon: "image", type: "file" },
    // { id: 3, key: "Record Audio", icon: "mic", type: "audio" },
    { id: 4, key: "Record Video", icon: "video", type: "video" },
]

class SelectOptionModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
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
                    {
                        options.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => this.handleOptionClick(item.type)}>
                                    <View style={{ paddingHorizontal: 15, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                        <Icon name={item.icon} size={24} color={appGreyColor} />
                                        <Text style={{ fontSize: 20, paddingVertical: 10, paddingHorizontal: 15 }}>{item.key}</Text>
                                    </View>
                                    <View style={{ backgroundColor: "#ccc", height: 1, marginHorizontal: 10 }} />
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </Modal>
        );
    }

    handleOptionClick(type) {
        this.onCancel()
        this.props.onItemPress(type)
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

export default SelectOptionModal;