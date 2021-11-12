
import { isTablet } from 'react-native-device-detection';

export default {
    container: {
    },
    modal: {        
        width: isTablet ? '55%' : '90%',
        alignSelf: 'center',
    },
    scroll: {
      
    },
    close: {
        backgroundColor: "rgb(35,71,95)",
        alignItems: "flex-end",
        height: 30,
    },
    closeImage: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
    },
    modalContent: {
        maxHeight: isTablet ? 700 : '80%',
        backgroundColor: "rgb(35,71,95)",
        padding: 22,
        paddingTop: 0,
    },
    item: {
        flexDirection: 'column',
        width: '100%',
        marginBottom: 15,
    },
    itemRow: {
        flexDirection: 'row',
        width: '100%',
    },

    itemTitle: {
        fontSize: 20,
    },
    itemText: {
        fontSize: 12,
        flex: 2.6,
    },
    itemButton: {
        backgroundColor: 'rgb(250,80,121)',
        flex: 1.1,
        alignItems: 'center',
        justifyContent: 'center',
        padding:3
    },
    itemButtonText: {
        fontSize: 15,
    },
    restoreButton: {
        backgroundColor: 'rgb(250,80,121)',
        padding:5,
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    restoreButtonText: {
        fontSize: 18,
        textAlign: 'center',
    }
};