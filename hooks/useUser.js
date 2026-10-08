import React, { useEffect, useState } from "react";
import LocalStore from "../lib/LocalStore";

const useUser = (withSession = true) => {
    const [theUser, setTheUser] = useState(null);

    const init = async () => {
        let u = await LocalStore.getItem('user_data') ?? null;
        let tok = await LocalStore.getItem('user_token');

        if (u !== null) {
            u['token'] = tok;
        }

        setTheUser(u);
    }
    useEffect(() => {
        init();
    }, []);

    const changeUser = async (newValue) => {
        if (withSession) {
            await LocalStore.setItem('user_data', newValue);
        }
        
        setTheUser(newValue);
    }

    return [
        theUser, changeUser, init
    ]
}

export default useUser;