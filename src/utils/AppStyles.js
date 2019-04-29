import { StyleSheet } from "react-native";

const primaryColor = "#7BABED"
const appPinkColor = "#ff6b81"
const appYellowColor = "#fad390"
const appGreyColor = "grey"

const defButtonContainer = {
    backgroundColor: appYellowColor,
    paddingVertical: 15,
    borderRadius: 30,
}

const defButtonText = {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
}

const defTextInputStyle = StyleSheet.create({
    input: {
        flex: 1,
        height: 40,
        marginBottom: 10,
        padding: 10,
        color: '#000',
        backgroundColor: '#f8f8f8',
        borderRadius: 30,
        // fontFamily: defaultFont
    },
    inputLoc: {
        marginTop: 5,
        marginBottom: 5,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 30,
        // fontFamily: defaultFont
    },
    icon: {
        position: 'relative',
        top: -2.883,
        paddingBottom: 3,
        paddingRight: 10,
        right: -4
    },
    inputsection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    bottomset: {
        position: "absolute", left: 0, right: 0, bottom: 10, paddingRight: 20, paddingLeft: 20, backgroundColor: '#FEFEFE'
    },
})

export { primaryColor, appPinkColor, appYellowColor, appGreyColor, defTextInputStyle, defButtonContainer, defButtonText }