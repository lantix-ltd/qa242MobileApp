import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Animated, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

class Panel extends React.Component {
    constructor(props) {
        super(props);

        this.icons = {
            'up': 'chevron-up',
            'down': 'chevron-down'
        };

        if (props.collapse === "false") {
            this.state = {
                timeStamp: props.timeStamp,
                title: props.title,
                titleColor: props.titleColor != undefined ? props.titleColor : "#4D5761",
                expanded: props.collapse === "true" ? false : true,
                animation: new Animated.Value()
            };
        } else {
            this.state = {
                title: props.title,
                timeStamp: props.timeStamp,
                titleColor: props.titleColor != undefined ? props.titleColor : "#4D5761",
                expanded: props.collapse === "true" ? false : true
            };
        }
    }

    toggle() {
        let initialValue = this.state.expanded ? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
            finalValue = this.state.expanded ? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

        this.setState({
            expanded: !this.state.expanded
        });

        this.state.animation.setValue(initialValue);
        Animated.spring(
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();
    }

    _setMaxHeight(event) {
        this.setState({
            maxHeight: event.nativeEvent.layout.height
        });
    }

    _setMinHeight(event) {
        if (this.props.collapse === "true") {
            this.setState({
                minHeight: event.nativeEvent.layout.height,
                animation: new Animated.Value(event.nativeEvent.layout.height)
            });
        } else {
            this.setState({
                minHeight: event.nativeEvent.layout.height,
                // animation: new Animated.Value(event.nativeEvent.layout.height)            
            });
        }
    }

    render() {
        let icon = this.icons['down'];

        if (this.state.expanded) {
            icon = this.icons['up'];
        }

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Animated.View
                    style={[styles.container, { height: this.state.animation }]}>
                    <View style={styles.titleContainer} onLayout={this._setMinHeight.bind(this)}>
                        <TouchableHighlight
                            style={{ flex: 1 }}
                            underlayColor="#f1f1f1"
                            onPress={() => { this.handleItemClick() }}
                        >
                            <View style={{ paddingVertical: 5 }}>
                                {this.state.timeStamp &&
                                    < Text style={{ fontSize: 13, paddingHorizontal: 10, color: "#4D5761", marginBottom: 5 }}>
                                        {this.state.timeStamp}
                                    </Text>
                                }
                                <Text style={[styles.title, { color: this.state.titleColor }]}>{this.state.title}</Text>
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight
                            style={{ marginRight: 10, borderRadius: 150 / 2, padding: 10 }}
                            onPress={this.toggle.bind(this)}
                            underlayColor="#f1f1f1">
                            <Icon name={icon} style={styles.icon} size={20} color="#4D5761" />
                        </TouchableHighlight>
                    </View>

                    <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}>
                        {this.props.children}
                    </View>

                </Animated.View>
            </SafeAreaView >
        );
    }

    handleItemClick() {
        if (this.props.onItemClick != undefined) {
            this.props.onItemClick()
        }
    }
}

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        margin: 10,
        overflow: 'hidden',
        borderRadius: 5
    },
    titleContainer: {
        flexDirection: 'row'
    },
    title: {
        flex: 1,
        paddingHorizontal: 10,
        fontWeight: 'bold'
    },
    body: {
        padding: 10,
        paddingTop: 0
    }
});

export default Panel;