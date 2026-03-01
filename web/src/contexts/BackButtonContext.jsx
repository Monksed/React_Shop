import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { backButton } from "@telegram-apps/sdk-react";

const BackButtonContext = createContext();

export const BackButtonProvider = ({ children }) => {
    const funcRef = useRef(undefined);
    const [visible, setVisible] = useState(false);
    const isInitialized = useRef(false);
    const previewFuncRed = useRef(undefined);

    useEffect(() => {
        if (!isInitialized.current) {
            backButton.onClick(() => {
                const top = funcRef.current;
                if (top) top();
            });
            isInitialized.current = true;
        }
    }, []);

    useEffect(() => {
        if (funcRef.current) {
            if (!visible) {
                backButton.show();
                setVisible(true);
            }
        } else {
            if (visible) {
                backButton.hide();
                setVisible(false);
            }
        }
    }, [funcRef.current]);

    const action = (fn) => {
        funcRef.current = fn;
        backButton.show();
        setVisible(true);
    };

    const clear = () => {
        funcRef.current = null;
        backButton.hide();
        setVisible(false);
    }

    const actionPreview = (fn) => {
        if (funcRef.current) {
            previewFuncRed.current = funcRef.current;
        }

        funcRef.current = fn;
        backButton.show();
        setVisible(true);
    }

    const returnPreview = () => {
        if (previewFuncRed.current) {
            funcRef.current = previewFuncRed.current;
            setVisible(true);
            backButton.show();
        } else {
            funcRef.current = null;
            setVisible(false);
            backButton.hide();
        }
    }
    return (
        <BackButtonContext.Provider value={{ action, clear, actionPreview, returnPreview}}>
            {children}
        </BackButtonContext.Provider>
    );
};
export const useBackButtonManager = () => useContext(BackButtonContext);