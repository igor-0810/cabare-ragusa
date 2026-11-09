import type { Lang } from './i18n';

type Item = Record<Lang, { name: string; desc: string }>;

export const menuTabs = [
  { id: 'cocktails', label: { mk: 'Коктели', en: 'Cocktails' } },
  { id: 'champagne', label: { mk: 'Шампањ', en: 'Champagne' } },
  { id: 'food', label: { mk: 'Храна', en: 'Food' } },
  { id: 'soft', label: { mk: 'Безалкохолно', en: 'Soft drinks' } },
] as const;

export type TabId = (typeof menuTabs)[number]['id'];

// Sample content: replace with the real menu (and add prices).
export const menuItems: Record<TabId, Item[]> = {
  cocktails: [
    { mk: { name: 'Негрони', desc: 'Џин, вермут, битер. Класика со парче портокал.' }, en: { name: 'Negroni', desc: 'Gin, vermouth, bitter. A classic with an orange slice.' } },
    { mk: { name: 'Френч 75', desc: 'Џин, лимон, пенливо вино. Лесен и свеж.' }, en: { name: 'French 75', desc: 'Gin, lemon, sparkling wine. Light and fresh.' } },
    { mk: { name: 'Олд фешнд', desc: 'Виски, шеќер, ароматичен битер.' }, en: { name: 'Old Fashioned', desc: 'Whiskey, sugar, aromatic bitters.' } },
    { mk: { name: 'Кир ројал', desc: 'Пенливо вино со капка ликер од рибизла.' }, en: { name: 'Kir Royale', desc: 'Sparkling wine with a drop of blackcurrant liqueur.' } },
  ],
  champagne: [
    { mk: { name: 'Чаша пенливо', desc: 'Сервирано ладно, за наздравување.' }, en: { name: 'Glass of sparkling', desc: 'Served cold, for a toast.' } },
    { mk: { name: 'Шише шампањ', desc: 'За маса, со чаши и ладилник.' }, en: { name: 'Bottle of champagne', desc: 'For the table, with glasses and a cooler.' } },
    { mk: { name: 'Шампањска кула', desc: 'За посебни прилики, по претходна најава.' }, en: { name: 'Champagne tower', desc: 'For special occasions, by prior request.' } },
  ],
  food: [
    { mk: { name: 'Фингер фуд плата', desc: 'Мали залачиња за делење на маса.' }, en: { name: 'Finger food platter', desc: 'Small bites to share at the table.' } },
    { mk: { name: 'Сирења и сувомеснато', desc: 'Избор на сирења, маслинки и ореви.' }, en: { name: 'Cheese and charcuterie', desc: 'A selection of cheeses, olives and nuts.' } },
    { mk: { name: 'Слатка плата', desc: 'Мини десерти и свежо овошје.' }, en: { name: 'Sweet platter', desc: 'Mini desserts and fresh fruit.' } },
  ],
  soft: [
    { mk: { name: 'Лимонада со босилек', desc: 'Свежо цеден лимон и сируп од босилек.' }, en: { name: 'Basil lemonade', desc: 'Fresh lemon and basil syrup.' } },
    { mk: { name: 'Безалкохолен коктел', desc: 'Овошен микс со мраз и мента.' }, en: { name: 'Mocktail', desc: 'Fruit mix with ice and mint.' } },
    { mk: { name: 'Минерална вода', desc: 'Газирана или негазирана.' }, en: { name: 'Mineral water', desc: 'Sparkling or still.' } },
  ],
};
