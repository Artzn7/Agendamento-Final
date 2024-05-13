import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";
import { AdmStack } from "./admStack"; // Importe a stack de navegação do AdmStack
import { useAuth } from "../contexts/Auth";

export function Router(){
    const { authData } = useAuth();
    
    return (
        <NavigationContainer>
            {authData ? (
                authData.isAdmin ? <AdmStack /> : <AppStack />
            ) : (
                <AuthStack />
            )}
        </NavigationContainer>
    );
}
