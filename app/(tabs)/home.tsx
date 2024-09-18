import { Alert, FlatList, Image, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import SearchInput from '@/components/SearchInput'
import { StatusBar } from 'expo-status-bar'
import Trending from '@/components/Trending'
import EmptyState from '@/components/EmptyState'
import { getAllPosts, getLatestPosts } from '@/lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
import VideoScreen from '@/components/VideoPlayerTest'
import { useGlobalContext } from '@/context/GlobalProvider'
const Home = () => {

  const { user, setUser, setIsLogged } = useGlobalContext();
  const {data: posts, refetch} = useAppwrite(getAllPosts)
  const {data: latestPosts} = useAppwrite(getLatestPosts)

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async()=>{
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
         <VideoCard video={item} />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  resizeMode='contain'
                  className="w-9 h-10"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-2">
              <Text className="text-gray-100 text-lg font-pregular">
                Latest Videos
              </Text>
            </View>
            <Trending posts={latestPosts ?? []} />
          </View>
        )}

        ListEmptyComponent={()=>(
          <EmptyState 
            title="No Videos Found"
            subtitle="Be the first one to upload one!"
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}

      />

      <StatusBar style='light' />
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({})