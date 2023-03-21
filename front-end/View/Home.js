import { View, Text } from 'react-native';
import { USER_TYPES } from '../controllers/auth/user';
import Footer from './Footer';

export default function Home(props) {
    const userType = props.route.params.userType;

    return (  
        <View style={{ flex: 1 }}>
            <Text>{userType} Home</Text>
            <Footer />
        </View>
    );
}