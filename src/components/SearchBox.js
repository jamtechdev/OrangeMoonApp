/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import {  View, StyleSheet } from 'react-native';
import {  Searchbar } from 'react-native-paper';

export default function SearchBox({ handleSearch,searchQuery }){

    return(
        <View style={styles.box}>
            <Searchbar
                placeholder="Search"
                onChangeText={handleSearch}
                value={searchQuery}
                style={styles.searchBox}
            />
        </View>
    )
}

const styles = StyleSheet.create({

    searchBox : {
        backgroundColor: '#f5f5f5',
        marginTop: 10,
    },
})