// Liste statique des 58 wilayas algériennes avec leurs communes principales
// Source: Découpage administratif de l'Algérie

export interface Wilaya {
  code: string;
  name: string;
  communes: string[];
}

export const WILAYAS: Wilaya[] = [
  { code: "01", name: "Adrar", communes: ["Adrar", "Reggane", "Timimoun", "In Salah", "Aoulef", "Tsabit", "Fenoughil", "Zaouiet Kounta"] },
  { code: "02", name: "Chlef", communes: ["Chlef", "Ténès", "El Karimia", "Oued Fodda", "Boukadir", "Ain Merane", "Ouled Fares"] },
  { code: "03", name: "Laghouat", communes: ["Laghouat", "Aflou", "Ksar El Hirane", "Hassi R'Mel", "Ain Madhi"] },
  { code: "04", name: "Oum El Bouaghi", communes: ["Oum El Bouaghi", "Ain Beida", "Ain M'lila", "Meskiana", "Sigus", "Ain Fakroun"] },
  { code: "05", name: "Batna", communes: ["Batna", "Barika", "N'Gaous", "Merouana", "Ain Touta", "Arris", "Tazoult"] },
  { code: "06", name: "Béjaïa", communes: ["Béjaïa", "Akbou", "El Kseur", "Sidi Aich", "Kherrata", "Amizour", "Tichy", "Aokas"] },
  { code: "07", name: "Biskra", communes: ["Biskra", "Tolga", "Ouled Djellal", "Sidi Okba", "El Kantara", "M'Chounèche", "Foughala"] },
  { code: "08", name: "Béchar", communes: ["Béchar", "Kenadsa", "Abadla", "Beni Ounif", "Taghit"] },
  { code: "09", name: "Blida", communes: ["Blida", "Boufarik", "Bouinan", "El Affroun", "Mouzaia", "Beni Mered", "Ouled Yaich", "Chréa"] },
  { code: "10", name: "Bouira", communes: ["Bouira", "Lakhdaria", "Sour El Ghozlane", "M'Chedallah", "Ain Bessem", "Kadiria"] },
  { code: "11", name: "Tamanrasset", communes: ["Tamanrasset", "In Guezzam", "Ain Salah", "Ideles", "Tazrouk"] },
  { code: "12", name: "Tébessa", communes: ["Tébessa", "Bir El Ater", "Cheria", "El Aouinet", "Morsott", "El Ogla"] },
  { code: "13", name: "Tlemcen", communes: ["Tlemcen", "Ghazaouet", "Remchi", "Maghnia", "Nedroma", "Sebdou", "Hennaya"] },
  { code: "14", name: "Tiaret", communes: ["Tiaret", "Sougueur", "Frenda", "Ksar Chellala", "Mahdia", "Ain Deheb", "Rahouia"] },
  { code: "15", name: "Tizi Ouzou", communes: ["Tizi Ouzou", "Azazga", "Draa Ben Khedda", "Ain El Hammam", "Larbaa Nath Irathen", "Tigzirt", "Boghni"] },
  { code: "16", name: "Alger", communes: ["Alger Centre", "Bab El Oued", "Hussein Dey", "El Harrach", "Bab Ezzouar", "Bir Mourad Raïs", "Bouzareah", "Chéraga", "Draria", "Dely Ibrahim", "El Biar", "Kouba", "Sidi M'Hamed", "Zeralda", "Ain Benian", "Bordj El Kiffan", "Rouiba", "Reghaia", "Dar El Beida"] },
  { code: "17", name: "Djelfa", communes: ["Djelfa", "Ain Oussera", "Messaad", "Hassi Bahbah", "Moudjbara", "Birine"] },
  { code: "18", name: "Jijel", communes: ["Jijel", "Taher", "El Milia", "Chekfa", "Ziama Mansouriah", "Texenna"] },
  { code: "19", name: "Sétif", communes: ["Sétif", "El Eulma", "Ain Oulmene", "Bougaa", "Ain El Kebira", "Ain Arnat", "Djemila"] },
  { code: "20", name: "Saïda", communes: ["Saïda", "Ain El Hadjar", "Youb", "Hassasna", "Ouled Khaled"] },
  { code: "21", name: "Skikda", communes: ["Skikda", "Azzaba", "El Harrouch", "Collo", "Tamalous", "Ain Kechra"] },
  { code: "22", name: "Sidi Bel Abbès", communes: ["Sidi Bel Abbès", "Telagh", "Ain El Berd", "Ben Badis", "Sfisef", "Mostefa Ben Brahim"] },
  { code: "23", name: "Annaba", communes: ["Annaba", "El Bouni", "El Hadjar", "Berrahal", "Ain El Berda", "Seraïdi"] },
  { code: "24", name: "Guelma", communes: ["Guelma", "Bouchegouf", "Oued Zenati", "Héliopolis", "Hammam Debagh"] },
  { code: "25", name: "Constantine", communes: ["Constantine", "El Khroub", "Ain Smara", "Hamma Bouziane", "Didouche Mourad", "Zighoud Youcef"] },
  { code: "26", name: "Médéa", communes: ["Médéa", "Berrouaghia", "Ksar El Boukhari", "Tablat", "Ain Boucif", "Chahbounia"] },
  { code: "27", name: "Mostaganem", communes: ["Mostaganem", "Ain Tedles", "Hassi Mameche", "Sidi Ali", "Achaacha"] },
  { code: "28", name: "M'Sila", communes: ["M'Sila", "Bou Saada", "Ain El Melh", "Sidi Aissa", "Magra", "Hammam Dalaa"] },
  { code: "29", name: "Mascara", communes: ["Mascara", "Sig", "Mohammadia", "Tighennif", "Ain Fares", "Ghriss"] },
  { code: "30", name: "Ouargla", communes: ["Ouargla", "Hassi Messaoud", "Touggourt", "Taibet", "El Hadjira"] },
  { code: "31", name: "Oran", communes: ["Oran", "Es Sénia", "Arzew", "Ain Turk", "Bir El Djir", "Bethioua", "Gdyel", "Bousfer", "Mers El Kébir"] },
  { code: "32", name: "El Bayadh", communes: ["El Bayadh", "Brezina", "Labiod Sidi Cheikh", "Bougtob", "Boualem"] },
  { code: "33", name: "Illizi", communes: ["Illizi", "Djanet", "In Amenas", "Bordj Omar Driss"] },
  { code: "34", name: "Bordj Bou Arréridj", communes: ["Bordj Bou Arréridj", "Ras El Oued", "El Achir", "Bordj Ghdir", "Mansourah", "Medjana"] },
  { code: "35", name: "Boumerdès", communes: ["Boumerdès", "Bordj Menaïel", "Dellys", "Khemis El Khechna", "Naciria", "Corso", "Thénia", "Boudouaou"] },
  { code: "36", name: "El Tarf", communes: ["El Tarf", "El Kala", "Ben M'Hidi", "Bouteldja", "Besbes", "Drean"] },
  { code: "37", name: "Tindouf", communes: ["Tindouf", "Oum El Assel"] },
  { code: "38", name: "Tissemsilt", communes: ["Tissemsilt", "Theniet El Had", "Bordj Bounâama", "Khemisti", "Lardjem"] },
  { code: "39", name: "El Oued", communes: ["El Oued", "Guemar", "Robbah", "Bayadha", "Debila", "Hassi Khalifa"] },
  { code: "40", name: "Khenchela", communes: ["Khenchela", "Kais", "Ain Touila", "Babar", "Chechar", "Bouhmama"] },
  { code: "41", name: "Souk Ahras", communes: ["Souk Ahras", "Sedrata", "Mechroha", "M'Daourouch", "Taoura", "Hanancha"] },
  { code: "42", name: "Tipaza", communes: ["Tipaza", "Cherchell", "Koléa", "Hadjout", "Gouraya", "Bou Ismaïl", "Fouka", "Ahmer El Ain"] },
  { code: "43", name: "Mila", communes: ["Mila", "Chelghoum Laïd", "Ferdjioua", "Oued Athmania", "Grarem Gouga", "Telerghma"] },
  { code: "44", name: "Aïn Defla", communes: ["Aïn Defla", "Miliana", "Khemis Miliana", "El Attaf", "Djelida", "El Abadia"] },
  { code: "45", name: "Naâma", communes: ["Naâma", "Mécheria", "Ain Sefra", "Moghrar", "Tiout"] },
  { code: "46", name: "Aïn Témouchent", communes: ["Aïn Témouchent", "El Malah", "El Amria", "Beni Saf", "Hammam Bouhadjar"] },
  { code: "47", name: "Ghardaïa", communes: ["Ghardaïa", "Metlili", "El Meniaa", "Berriane", "Guerrara", "Daya Ben Dahoua"] },
  { code: "48", name: "Relizane", communes: ["Relizane", "Oued Rhiou", "Mazouna", "Zemmora", "Ain Tarek", "Mendes"] },
  { code: "49", name: "El M'Ghair", communes: ["El M'Ghair", "Djamaa", "Oum Touyour", "Sidi Khellil", "Still"] },
  { code: "50", name: "El Meniaa", communes: ["El Meniaa", "Hassi Gara"] },
  { code: "51", name: "Ouled Djellal", communes: ["Ouled Djellal", "Sidi Khaled", "Doucen", "Ech Chaïba"] },
  { code: "52", name: "Bordj Badji Mokhtar", communes: ["Bordj Badji Mokhtar", "Timiaouine"] },
  { code: "53", name: "Béni Abbès", communes: ["Béni Abbès", "El Ouata", "Igli", "Tamtert"] },
  { code: "54", name: "Timimoun", communes: ["Timimoun", "Charouine", "Ouled Said", "Aougrout"] },
  { code: "55", name: "Touggourt", communes: ["Touggourt", "Temacine", "Megarine", "Nezla", "Taibet"] },
  { code: "56", name: "Djanet", communes: ["Djanet", "Bordj El Haoues"] },
  { code: "57", name: "In Salah", communes: ["In Salah", "In Ghar", "Foggaret Ezzaouia"] },
  { code: "58", name: "In Guezzam", communes: ["In Guezzam", "Tin Zaouatine"] },
];

export function getWilayaByCode(code: string): Wilaya | undefined {
  return WILAYAS.find(w => w.code === code);
}

export function getCommunesByWilaya(wilayaName: string): string[] {
  const wilaya = WILAYAS.find(w => w.name === wilayaName);
  return wilaya?.communes ?? [];
}
