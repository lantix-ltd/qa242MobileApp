import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { CheckBox, ButtonGroup, Button } from 'react-native-elements'

const acceptUnaccept = ["Acceptable", "Unacceptable"]

class FormNo4QView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: props.title,
            selectedIndex: 0,
            correctiveAction: "",
            isCorrectiveActionVisible: false
        }
    }

    handleButtonChange(indx) {
        this.setState({ selectedIndex: indx })
        this.props.onButtonChange(indx)
    }

    handleInputTextChange(text) {
        this.setState({ correctiveAction: text })
        this.props.onTextChange(text)
    }

    render() {
        const hintColor = "#ccc"
        return (
            <View style={[styles.round_white_bg_container]}>
                <Text>{this.state.title} </Text>
                <ButtonGroup
                    selectedIndex={this.state.selectedIndex}
                    onPress={(index) => this.handleButtonChange(index)}
                    buttons={acceptUnaccept}
                    containerStyle={{ height: 45 }}
                />
                {this.state.selectedIndex == 1 &&
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.correctiveAction}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='Corrective Action'
                        onChangeText={(text) => this.handleInputTextChange(text)}
                        placeholderTextColor={hintColor} />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    round_white_bg_container: {
        backgroundColor: '#fff',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        padding: 5,
        borderRadius: 5
    },
});

export default FormNo4QView
