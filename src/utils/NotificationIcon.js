import React from 'react';
import { Text, View, Platform, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'
import { connect } from "react-redux"
import { withNavigation } from "react-navigation"
import { textFont, secondaryColor, primaryColor } from './AppStyles';

const NotificationIcon = (props) => {
    return (
        <View >
            <TouchableOpacity
                activeOpacity={0.5}
                style={{ padding: 10 }}
                onPress={() => { props.resetCounter(), props.navigation.navigate('Notifications') }}>
                <Text style={{
                    fontSize: 17,
                    color: secondaryColor,
                    ...textFont
                }}
                    numberOfLines={1} ellipsizeMode='tail'>
                    <Icon name="bell" size={20} color={"#fff"} />
                </Text>
                {props.counter > 0 &&
                    <Text style={{ backgroundColor: primaryColor, position: "absolute", right: 0, top: 5, borderRadius: 150 / 2, height: 10, width: 10 }} />
                }
            </TouchableOpacity>
        </View>
    )
}

const mapStateToProps = (state) => {
    return {
        counter: state.counter
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateCounter: (counts) => dispatch({ type: 'UPDATE_NOTIFICATIONS_COUNTER', counts: counts }),
        resetCounter: () => dispatch({ type: 'RESET_NOTIFICATIONS_COUNTER' })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(NotificationIcon))