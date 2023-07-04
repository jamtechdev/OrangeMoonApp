/* eslint-disable prettier/prettier */
import { StyleSheet } from 'react-native';
import { AppStyles, AppIcon } from '../AppStyles';
const globalStyles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
    title: {
        fontSize: AppStyles.fontSize.title,
        fontWeight: 'bold',
        color: AppStyles.color.primaryColor,
        textAlign: 'center',
        marginLeft: 20,
        marginRight: 20,
        marginTop:20,
    },
    inputStyle:{
        width: AppStyles.textInputWidth.main,
        marginTop: 10,
    },
    errorMsg: {
        color: AppStyles.color.error,
    },
    linkStyle:{
        color: AppStyles.color.blue, 
        textDecorationLine: 'underline', 
        fontWeight: 600, 
    }
});

export default globalStyles;
