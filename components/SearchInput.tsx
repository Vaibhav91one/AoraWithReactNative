import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { TextInput , Image} from 'react-native'
import { TouchableOpacity } from 'react-native'
import { icons } from '@/constants'
import { router, usePathname } from 'expo-router'

const SearchInput = ({initialQuery}: any) => {

    const pathName = usePathname();
    const [query, setQuery] = useState(initialQuery || '')
    
  return (
      <View className="flex-row border-2 border-black-200 w-full h-16 p-4 bg-black-100 rounded-2xl focus:border-secondary items-center">
            <TextInput 
                className="text-base mt-0.5 text-white flex-1 font-pregular"
                value={query}
                placeholder="Searc for a video topic"
                placeholderTextColor="#CDCDE0"
                onChangeText={(e)=> setQuery(e)}
            />
            <TouchableOpacity
                onPress={()=>{
                    if(!query){
                        return Alert.alert('Missing Query!', "Please input something to search results.")
                    }
                    if(pathName.startsWith('/search')) router.setParams({query})
                    
                    else router.push(`/search/${query}`)      
                }}
            >
                    <Image
                        source={icons.search}
                        className="w-5 h-5"
                        resizeMode= "contain"
                    />
                </TouchableOpacity>

      </View>
  )
}

export default SearchInput

const styles = StyleSheet.create({})