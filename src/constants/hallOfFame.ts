import { Itinerary } from '../../types.ts';

export interface HallOfFameQuest {
    title: string;
    location: string;
    stopsCount: number;
    image: string;
    author: string;
    itinerary: Itinerary;
}

export const HALL_OF_FAME_QUESTS: HallOfFameQuest[] = [
    {
        title: "The Parisian Pastry Pilgrimage",
        location: "Paris, France",
        stopsCount: 3,
        image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800",
        author: "Sir Sugar-A-Lot",
        itinerary: {
            theme: "The Parisian Pastry Pilgrimage",
            total_estimated_cost: "€40 - €60",
            stops: [
                {
                    name: "Cédric Grolet Opéra",
                    address: "35 Av. de l'Opéra, 75002 Paris, France",
                    hours_of_operation: "9:30 AM - 6:00 PM",
                    notes: "A temple of fruit-inspired hyper-realism and buttery perfection.",
                    reason: "Cédric Grolet is a master of form and flavor, turning simple fruits into edible sculptures.",
                    recommendations: [
                        { item: "The Trompe-l'œil Apple", description: "A stunningly realistic apple made of white chocolate mousse and fresh apple compote." },
                        { item: "Pain au Chocolat", description: "The most laminated, flaky, and buttery pastry you will ever experience." }
                    ],
                    image_prompt: "A close-up of a hyper-realistic apple pastry on a marble counter, sunlight streaming through a Parisian window, elegant gold accents.",
                    category: "pastry"
                },
                {
                    name: "Stohrer",
                    address: "51 Rue Montorgueil, 75002 Paris, France",
                    hours_of_operation: "8:00 AM - 8:00 PM",
                    notes: "The oldest patisserie in Paris, serving royalty since 1730.",
                    reason: "Walking into Stohrer is like stepping back in time to the height of French culinary history.",
                    recommendations: [
                        { item: "Baba au Rhum", description: "The original recipe, soaked in aged rum and topped with vanilla cream." },
                        { item: "Puits d'Amour", description: "A puff pastry filled with vanilla custard and topped with caramelized sugar." }
                    ],
                    image_prompt: "The ornate, historic interior of an 18th-century French bakery, crystal chandeliers, shelves filled with classic pastries, warm amber lighting.",
                    category: "pastry"
                },
                {
                    name: "Pierre Hermé",
                    address: "72 Rue Bonaparte, 75006 Paris, France",
                    hours_of_operation: "10:00 AM - 7:00 PM",
                    notes: "The 'Picasso of Pastry' and his laboratory of flavor.",
                    reason: "Pierre Hermé redefined the macaron with bold, unexpected flavor combinations.",
                    recommendations: [
                        { item: "Ispahan Macaron", description: "A large macaron with rose, raspberry, and lychee." },
                        { item: "2000 Feuilles", description: "A decadent take on the mille-feuille with praline cream." }
                    ],
                    image_prompt: "A vibrant display of colorful macarons in a sleek, modern boutique, minimalist design, soft focus on a pink rose macaron.",
                    category: "pastry"
                }
            ]
        }
    },
    {
        title: "Tokyo's Neon Matcha Trail",
        location: "Tokyo, Japan",
        stopsCount: 3,
        image: "https://images.unsplash.com/photo-1536184071535-78906f7172c2?auto=format&fit=crop&q=80&w=800",
        author: "GreenTeaGhost",
        itinerary: {
            theme: "Tokyo's Neon Matcha Trail",
            total_estimated_cost: "¥4000 - ¥6000",
            stops: [
                {
                    name: "Suzukien Asakusa",
                    address: "3 Chome-4-3 Asakusa, Taito City, Tokyo 111-0032, Japan",
                    hours_of_operation: "11:00 AM - 5:00 PM",
                    notes: "Home to the world's most intense matcha gelato.",
                    reason: "They offer seven levels of matcha intensity, allowing you to test the limits of your palate.",
                    recommendations: [
                        { item: "Matcha Gelato Level 7", description: "The strongest matcha flavor in the world, deep green and incredibly rich." },
                        { item: "Hojicha Gelato", description: "A roasted green tea flavor with nutty, smoky undertones." }
                    ],
                    image_prompt: "A scoop of deep, forest-green gelato in a black waffle cone, held against a backdrop of traditional Japanese lanterns in Asakusa.",
                    category: "ice-cream"
                },
                {
                    name: "Nana's Green Tea",
                    address: "Various locations (Skytree Solamachi)",
                    hours_of_operation: "10:00 AM - 9:00 PM",
                    notes: "A modern take on traditional Japanese tea house culture.",
                    reason: "Perfect for experiencing how matcha integrates into modern cafe culture with parfaits and lattes.",
                    recommendations: [
                        { item: "Matcha Shiratama Parfait", description: "Layers of matcha jelly, cornflakes, matcha ice cream, and chewy mochi balls." },
                        { item: "Matcha Latte", description: "Smooth, whisked-to-order matcha with creamy milk." }
                    ],
                    image_prompt: "A tall, layered dessert parfait with green tea ice cream and white mochi, bright neon lights of Tokyo reflecting in the window.",
                    category: "ice-cream"
                },
                {
                    name: "Hidemi Sugino",
                    address: "3 Chome-6-17 Kyobashi, Chuo City, Tokyo 104-0031, Japan",
                    hours_of_operation: "11:00 AM - 7:00 PM",
                    notes: "A master of mousse and delicate textures.",
                    reason: "Sugino's cakes are legendary for their ephemeral, light-as-air quality.",
                    recommendations: [
                        { item: "Ambroisie", description: "A chocolate mousse cake that won the Coupe du Monde de la Pâtisserie." },
                        { item: "Matcha Mousse", description: "A seasonal delicate mousse featuring premium Uji matcha." }
                    ],
                    image_prompt: "A minimalist, perfectly square chocolate cake on a white ceramic plate, soft natural light, clean lines, zen-like presentation.",
                    category: "cake"
                }
            ]
        }
    },
    {
        title: "The Brooklyn Brownie Run",
        location: "New York, USA",
        stopsCount: 3,
        image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&q=80&w=800",
        author: "CocoaCommander",
        itinerary: {
            theme: "The Brooklyn Brownie Run",
            total_estimated_cost: "$30 - $50",
            stops: [
                {
                    name: "Baked",
                    address: "359 Van Brunt St, Brooklyn, NY 11231",
                    hours_of_operation: "8:00 AM - 6:00 PM",
                    notes: "The bakery that started the modern brownie obsession.",
                    reason: "Their 'Sweet and Salty Brownie' is widely considered one of the best in America.",
                    recommendations: [
                        { item: "Sweet and Salty Brownie", description: "A deep, dark brownie with a layer of salted caramel in the middle." },
                        { item: "Brookster", description: "A chocolate chip cookie baked inside a brownie." }
                    ],
                    image_prompt: "A stack of thick, fudgy brownies with a visible swirl of caramel, rustic wooden table, industrial Brooklyn loft setting.",
                    category: "pastry"
                },
                {
                    name: "Fine & Raw Chocolate",
                    address: "70 Scott Ave, Brooklyn, NY 11237",
                    hours_of_operation: "10:00 AM - 6:00 PM",
                    notes: "Artisanal, raw chocolate made in the heart of Bushwick.",
                    reason: "They use low-heat processing to preserve the complex flavors of the cacao bean.",
                    recommendations: [
                        { item: "Truffle Brownie", description: "An incredibly rich, almost truffle-like brownie made with raw cacao." },
                        { item: "Sea Salt Chocolate Bar", description: "Their signature bar with hand-harvested sea salt." }
                    ],
                    image_prompt: "Raw cacao beans scattered around a dark chocolate bar, exposed brick wall, artistic and edgy atmosphere.",
                    category: "other"
                },
                {
                    name: "Martha's Country Bakery",
                    address: "175 Bedford Ave, Brooklyn, NY 11211",
                    hours_of_operation: "6:00 AM - 12:00 AM",
                    notes: "A neighborhood staple with a massive selection of classic American desserts.",
                    reason: "It's the perfect place to experience the scale and variety of New York's bakery scene.",
                    recommendations: [
                        { item: "Red Velvet Brownie", description: "A vibrant red brownie with a thick layer of cream cheese frosting." },
                        { item: "Mississippi Mud Pie", description: "A decadent, multi-layered chocolate explosion." }
                    ],
                    image_prompt: "A cozy, bustling bakery counter at night, warm yellow lights, display cases overflowing with cakes and brownies, people chatting in the background.",
                    category: "cake"
                }
            ]
        }
    }
];
