
import { isTablet } from 'react-native-device-detection';


export default {
    
    container: {
        width: '100%',
        flexDirection: 'row',
        padding: 20,
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    progress:{
        position: 'absolute',
        top:0,
        left:0
    },
    item: {
        width:  isTablet ? '29%': '46%',
        marginBottom: 10,
    },
    duration: {
        paddingLeft: 2,
        paddingRight: 2,
        fontSize: 8,
        backgroundColor: 'rgba(0,0,0, 0.5)',
        position: 'absolute',
        bottom: 0,
        marginBottom: 3,
        right: 0,
        marginRight: 3,
    },
    imageBorder: {
        width: '100%',
        borderWidth: 5,
        borderColor: 'rgba(255,255,255, 0.2)',
    },
    image: {
        height: isTablet ? 140 : 70,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 10,
    },

    ribbon: {
        position: 'absolute',
        top: 0,
        right: 0,
        resizeMode: 'contain',
    },

    centerImage: {
        alignSelf: 'center',
        height: '60%',
        resizeMode: 'contain',
    },
};