import {Platform} from 'react-native';
export default {
    container: {
        padding: 20,
        height: 75,
        padding: 0,
        backgroundColor: 'transparent',

    },
    innerContainer: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 30 : 10,
        flexDirection: 'row',
        justifyContent: 'center',

    },
    backButton: {
        flex: 1,
        marginTop: 10,
    },
    language: {
        alignItems: 'center',
        flex: 1,
        marginTop: -5,
    },
    menuButton: {
        flex: 1,
        paddingRight: 10,
    },
    menuButtonTouch: {
        alignSelf: 'flex-end',
        padding: 10
    },
    icon: {
        alignSelf: 'flex-end',
        resizeMode: 'contain',
        height: 20,
    },
    row: {
        flexDirection: 'row',
    },
    backIcon: {
        height: 25,
        width: 25,
        marginLeft: 5,
        alignSelf: 'flex-start',
        resizeMode: 'contain',
    },
    backText: {
        height: 30,justifyContent:'center',
        marginLeft: -7,
        marginTop: -3,
        alignSelf: 'flex-start',
    },
    title: {
        textAlign: 'center'
    }
};