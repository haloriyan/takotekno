import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";

const useGridCol = () => {
    const [theCol, setTheCol] = useState(2);
    const { width } = useWindowDimensions();

    useEffect(() => {
        if (width <= 480) {
            setTheCol(2);
        } else if (width > 480 && width <= 800) {
            setTheCol(3);
        } else if (width > 800) {
            setTheCol(4);
        }

        console.log(width);
        
    }, [width]);
    
    return [
        theCol
    ]
};

export default useGridCol;