import {FlatList,Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '@/components/SearchInput'
import { StatusBar } from 'expo-status-bar'
import EmptyState from '@/components/EmptyState'
import { searchPosts } from '@/lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { useLocalSearchParams } from 'expo-router'
const Search = () => {

  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(()=>searchPosts(query))

  console.log(query, posts)

  useEffect(() => {
    refetch()
  }, [query])

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item} />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">
              Search Results
            </Text>
            <Text className="text-xl font-psemibold text-white">
              {query}
            </Text>
            <View className="mt-6 mt-8">
            <SearchInput initialQuery={query} />
            </View>
          </View>
        )}

        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No Videos found for this search query"
          />
        )}
      />

      <StatusBar style='light' />
    </SafeAreaView>
  )
}

export default Search
