import 'react-native-url-polyfill/auto'

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.vaibhav.aora',
    projectid: 'your project id',
    databaseID: "your database id",
    userCollectionID: "your user collection id",
    videoCollectionID: "your video collection id",
    storageID: "your storage id"
}

const {
    endpoint,
    platform,
    projectid,
    databaseID,
    userCollectionID,
    videoCollectionID,
    storageID,
} = appwriteConfig

import { ID, Account, Client, Avatars, Databases, Query, Storage } from 'react-native-appwrite';
// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectid) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
    ;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password , username) => {
    try{
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username,
        )

        if(!newAccount) throw Error;
        
        const avatarURL = avatars.getInitials(username);


        const newUser = await databases.createDocument(appwriteConfig.databaseID, appwriteConfig.userCollectionID, ID.unique(), 
        {
            accountId: newAccount.$id,
            email,
            username,
            avatar: avatarURL
        })

        if(!newUser) throw Error;

        await signIn(email, password);

        return newUser;

    }
    catch(error){
        console.log(error);
        throw new Error(error);
    }
}

export const signIn = async(email, password) => {
    try {
        
        const session = await account.createEmailPasswordSession(email, password)

        return session;

    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async() =>{
    try{
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(appwriteConfig.databaseID, appwriteConfig.userCollectionID, [Query.equal('accountId', currentAccount.$id)])
        if(!currentUser) throw Error;

        return currentUser.documents[0];
    }
    catch(error){
        throw new Error(error)
    }
}

export const getAllPosts = async() => {
    try {
        const posts = await databases.listDocuments(
                databaseID,
                videoCollectionID,
                [Query.orderDesc('$createdAt')]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const getLatestPosts = async() => {
    try {
        const posts = await databases.listDocuments(
                databaseID,
                videoCollectionID,
                [Query.orderDesc('$createdAt', Query.limit(7))]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const searchPosts = async(query) => {
    try {
        const posts = await databases.listDocuments(
                databaseID,
                videoCollectionID,
                [Query.search('title', query)]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const getUserPosts = async(userId) => {
    try {
        const posts = await databases.listDocuments(
                databaseID,
                videoCollectionID,
                [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const signOut = async()=> {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        throw new Error(error)
    }
}
 
export const getFilePreview = async(fileId, type) => {
    let fileUrl;

    try {
        if(type ==='video'){
            fileUrl = storage.getFileView(storageID, fileId)
        }
        else if(type === 'image'){
            fileUrl = storage.getFilePreview(storageID, fileId, 2000, 2000, 'top', 100)
        }
        else{
            throw new Error('Invalid file type')
        }

        if(!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error)
    }
}

export const uploadFile = async(file, type) => {
    if(!file) return;

    const asset = 
    {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
    };

    try {
        const uploadedFile = await storage.createFile(storageID, ID.unique(), asset);

        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl;
    } catch (error) {
        throw new Error(error)
    }

}

export const createVideo = async(form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video')
        ])

        const newPost = await databases.createDocument(databaseID, videoCollectionID, ID.unique(), {
            title: form.title,
            thumbnail: thumbnailUrl,
            video: videoUrl,
            prompt: form.prompt,
            creator: form.userId
        })

        return newPost;
    } catch (error) {
        throw new Error(error)
    }
}