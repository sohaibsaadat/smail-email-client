import { useEffect, useState } from "react";

export const useResponsiveSlice = () => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    let sliceNumber
     if (width < 546) sliceNumber = 40;
     else if (width < 846) sliceNumber = 80;
    else if (width < 1180) sliceNumber = 100;
    else if (width < 1531) sliceNumber = 90;
    else sliceNumber = 120;
       return { width, sliceNumber };

};
