import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <img 
                src="/images/Logo-cecytem.png" 
                alt="CECyTEM" 
                {...props} 
                className={`block mx-auto my-auto max-w-full max-h-full ${props.className ?? ""}`}
            />
        </div>
    );
}
