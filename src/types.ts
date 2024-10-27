export type Category = 'brinquedos' | 'alimentos' | 'roupas' | 'moveis' | 'outros';

export type RootStackParamList = {
    Login: undefined;
    ForgotPassword: undefined;
    Register: undefined;
    Home: undefined;
    MainTabs: undefined;
    SelectDonationType: undefined;
    FinalizeDonation: { selectedCategories: Record<Category, boolean> };
};