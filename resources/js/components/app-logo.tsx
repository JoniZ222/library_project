import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center justify-center">
            <div className="flex items-center justify-center aspect-square size-8 rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-6 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-1 truncate leading-tight font-semibold">CECyTEM</span>
            </div>
        </div>
    );
}
