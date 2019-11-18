import React from 'react';
import { Text, View, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'
import { connect } from "react-redux"
import { withNavigation } from "react-navigation"
import { secondryColor } from './AppStyles';

const ChatNotificationIcon = (props) => {
    return (
        <View >
            <View style={{
                position: "absolute", height: 14, width: 14,
                borderRadius: 15, backgroundColor: secondryColor, alignItems: "center",
                justifyContent: "center", zIndex: 1500, right: 0, top: 0
            }}>
                {props.chat_counter > 0 &&
                    <Text style={{ backgroundColor: "red", position: "absolute", right: 0, top: 5, borderRadius: 150 / 2, height: 10, width: 10 }} />
                }
            </View>
            <Icon style={{ padding: 10 }}
                size={20} name="message-circle" color={props.tintColor} />
        </View>
    )
}

const mapStateToProps = (state) => {
    return {
        chat_counter: state.reducer2.chat_counter
    }
}

export default connect(mapStateToProps, null)(withNavigation(ChatNotificationIcon))