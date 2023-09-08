/* eslint-disable prettier/prettier */
import { Platform, StyleSheet } from 'react-native';
import { AppStyles, AppIcon } from '../AppStyles';
const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        marginTop: 20,
    },
    inputStyle: {
        width: AppStyles.textInputWidth.main,
        marginTop: 10,
    },
    errorMsg: {
        color: AppStyles.color.error,
    },
    linkView :{
        flex: 1,
        marginLeft: Platform.OS === 'android' ? 50 : 25,
    },
    linkStyle: {
        color: AppStyles.color.blue,
        textDecorationLine: 'underline',
        fontWeight: 600,
    },
    DataTable: {
        marginTop: 20,
    },
    header: {
        paddingHorizontal: 6,
        backgroundColor: AppStyles.color.background,
        borderBottomWidth: 1,
        color: AppStyles.color.white,
    },
    headerCell: {
        width: 200,
        height: 50,
    },
    headerCellDate: {
        width: 120,
        height: 50,
    },
    CellDate: {
        width: 100,
        height: 50,
    },
    cell: {
        width: 200,
        height: 55
    },
    emptyData: {
        padding: 20
    },
    divider: {
        height: 2,
        backgroundColor: '#ccc',
        marginTop: 10
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: AppStyles.color.title,
        marginBottom: 5,
        marginTop: 5
    },
    card: {
        marginVertical: 12,
    },
    cardContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 2,
        marginBottom: Platform.OS === 'android' ? 0 : 15,
    },
    imageRow: {
        flex: 1, 
        alignItems: 'flex-end',
        flexDirection: 'row',
     
    },
    leftImageIcon :{
        paddingBottom: 30,
        left : 25,
        zIndex: 100,
        
    },
    rightImageIcon: {
        paddingBottom: 30,
        right : 25,
        zIndex: 100,
    },
    fabGroup: {
        position: 'absolute',
        margin:  Platform.OS === 'android' ? 16 : 0,
        right: 0,
        bottom: 0,
    },
    flexOne:{
        flex:1,
        padding :3,
    },
    flexTwo:{
        flex:1,
        padding :3,
    },
    flexThree:{
        flex:1,
        padding :3,
    },
});

export default globalStyles;
