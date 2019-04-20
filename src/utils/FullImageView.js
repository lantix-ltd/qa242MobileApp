
import React, { Component } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Feather';
import { appGreyColor } from "../utils/AppStyles";

class FullImageView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            imageFile: null
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
                    <TouchableOpacity
                        style={{ position: "absolute", right: 0, top: 0, padding: 10, zIndex: 10 }}
                        onPress={() => this.onCancel()}>
                        <Icon name="x" size={28} color={appGreyColor} />
                    </TouchableOpacity>
                    {this.state.imageFile != null &&
                        <Image
                            resizeMode="contain"
                            style={{ width: "100%", height: "100%" }}
                            source={{ uri: this.state.imageFile }}
                        />
                    }
                </View>
            </Modal>
        );
    }

    handleOptionClick(type) {
        this.onCancel()
        this.props.onItemPress(type)
    }

    loadImage(file) {
        this.setState({ imageFile: file });
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
        flex: 1,
        backgroundColor: 'white'
    }
});

export default FullImageView;