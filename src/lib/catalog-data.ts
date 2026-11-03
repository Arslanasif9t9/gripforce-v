import beltImg from "@/assets/products/weightlifting-belt.jpg.asset.json";
import fingerImg from "@/assets/products/finger-trainer.jpg.asset.json";
import pushUpImg from "@/assets/products/push-up-bars.jpg.asset.json";
import bottleImg from "@/assets/products/insulated-bottle.jpg.asset.json";
import bandsImg from "@/assets/products/resistance-bands.jpg.asset.json";
import kettlebellImg from "@/assets/products/kettlebell.jpg.asset.json";
import dumbbellsImg from "@/assets/products/dumbbells.jpg.asset.json";
import foamRollerImg from "@/assets/products/foam-roller.jpg.asset.json";
import gripperImg from "@/assets/products/hand-gripper.jpg.asset.json";
import jumpRopeImg from "@/assets/products/jump-rope.jpg.asset.json";
import matImg from "@/assets/products/exercise-mat.jpg.asset.json";
import shakerImg from "@/assets/products/shaker-bottle.jpg.asset.json";
import wristWrapsImg from "@/assets/products/wrist-wraps.jpg.asset.json";
import strapsImg from "@/assets/products/lifting-straps.jpg.asset.json";
import duffelImg from "@/assets/products/duffel-bag.jpg.asset.json";
import abRoller1Img from "@/assets/products/ab-roller-1.jpg.asset.json";
import abRoller2Img from "@/assets/products/ab-roller-2.jpg.asset.json";
import glovesImg from "@/assets/products/gym-gloves.jpg.asset.json";
import starterKitImg from "@/assets/products/starter-kit.jpg.asset.json";

/**
 * The store's real product images, keyed by the product they show.
 * NOTE: the uploaded files' names do not match what the images actually show
 * (the ZIP arrived shuffled), so keys here deliberately point at the file
 * whose *content* is that product — verified by reading each infographic.
 */
export const PRODUCT_IMAGES = {
  "weightlifting-belt": beltImg.url, // correct
  "finger-trainer": fingerImg.url, // correct
  // file "insulated-bottle.jpg" shows the push-up bars card
  "push-up-bars": bottleImg.url,
  // file "kettlebell.jpg" shows the insulated water bottle card
  "insulated-bottle": kettlebellImg.url,
  // file "resistance-bands.jpg" shows the kettlebell card
  kettlebell: bandsImg.url,
  // file "dumbbells.jpg" shows the resistance bands card
  "resistance-bands": dumbbellsImg.url,
  // file "foam-roller.jpg" shows the dumbbells card
  dumbbells: foamRollerImg.url,
  // file "push-up-bars.jpg" shows the foam roller card
  "foam-roller": pushUpImg.url,
  // file "jump-rope.jpg" shows the adjustable hand gripper card
  "hand-gripper": jumpRopeImg.url,
  // file "exercise-mat.jpg" shows the speed jump rope card
  "jump-rope": matImg.url,
  // file "shaker-bottle.jpg" shows the exercise mat card
  "exercise-mat": shakerImg.url,
  // file "wrist-wraps.jpg" shows the protein shaker card
  "shaker-bottle": wristWrapsImg.url,
  // file "lifting-straps.jpg" shows the wrist wraps card
  "wrist-wraps": strapsImg.url,
  // file "duffel-bag.jpg" shows the lifting straps card
  "lifting-straps": duffelImg.url,
  // file "ab-roller-1.jpg" shows the gym duffel bag card
  "duffel-bag": abRoller1Img.url,
  // file "gym-gloves.jpg" shows an ab roller card (angle 1 of 2)
  "ab-roller-1": glovesImg.url,
  "ab-roller-2": abRoller2Img.url, // ab roller, angle 2 — correct
  // file "hand-gripper.jpg" shows the gym gloves card
  "gym-gloves": gripperImg.url,
  "starter-kit": starterKitImg.url, // 4-card collage — correct
} as const;

export type ProductImageKey = keyof typeof PRODUCT_IMAGES;

export type Product = {
  slug: string;
  name: string;
  description: string;
  /** Key selling points, taken from the product's own printed feature card. */
  features: string[];
  collection: string;
  collectionName: string;
  /** Placeholder USD price until the Shopify sync (Phase 3). */
  price: number;
  image: string;
  gallery: string[];
  sizes: string[] | null;
  isNew: boolean;
  isFeatured: boolean;
};

export const PRODUCTS: Product[] = [
  {
    slug: "grip-force-hand-gripper",
    name: "Grip Force Adjustable Hand Gripper 10–50 kg",
    description:
      "Build serious grip strength with an adjustable hand gripper that scales from 10 kg up to 50 kg of resistance. The ergonomic, non-slip design targets your forearm and hand muscles for both strength training and rehabilitation work.",
    features: [
      "Adjustable resistance from 10 kg to 50 kg",
      "Ergonomic, non-slip handle design",
      "Forearm & hand strengthening",
      "Durable, high-quality materials",
      "Portable, lightweight design",
    ],
    collection: "hand-grip",
    collectionName: "Hand & Grip",
    price: 24.99,
    image: PRODUCT_IMAGES["hand-gripper"],
    gallery: [PRODUCT_IMAGES["hand-gripper"]],
    sizes: null,
    isNew: true,
    isFeatured: true,
  },
  {
    slug: "grip-force-finger-trainer",
    name: "Grip Force Finger Trainer — Build Stronger Fingers & Hands",
    description:
      "Strengthen each finger and hand individually with a compact finger trainer that offers 7 adjustable resistance levels. Lightweight and flexible — train anywhere, anytime, and choose your ideal challenge level.",
    features: [
      "Strengthens fingers & hands",
      "7 adjustable resistance levels",
      "Lightweight & flexible",
      "Compact & portable",
      "Improves flexibility and hand strength",
    ],
    collection: "hand-grip",
    collectionName: "Hand & Grip",
    price: 13.99,
    image: PRODUCT_IMAGES["finger-trainer"],
    gallery: [PRODUCT_IMAGES["finger-trainer"]],
    sizes: null,
    isNew: false,
    isFeatured: false,
  },
  {
    slug: "grip-force-push-up-bars",
    name: "Grip Force Push-Up Bars — More Control, Stronger Push-Ups",
    description:
      "Take your push-ups to the next level with sturdy, comfortable push-up bars. The elevated grip improves range of motion, reduces wrist strain and lets you train your chest, arms and shoulders anywhere — home or gym.",
    features: [
      "Sturdy, stable support",
      "Comfortable, easy-grip handles",
      "Elevated grip for a deeper range of motion",
      "Compact & portable",
      "Upper-body training: chest, arms, shoulders",
    ],
    collection: "home-workout",
    collectionName: "Home Workout",
    price: 32.99,
    image: PRODUCT_IMAGES["push-up-bars"],
    gallery: [PRODUCT_IMAGES["push-up-bars"]],
    sizes: null,
    isNew: false,
    isFeatured: false,
  },
  {
    slug: "grip-force-insulated-water-bottle",
    name: "Grip Force Insulated Water Bottle — Stay Hydrated, Keep Moving",
    description:
      "A matte-black insulated bottle with double-wall vacuum insulation that keeps drinks cold or hot for hours. Durable stainless steel, a secure leak-resistant lid and an easy-carry loop make it perfect for gym, work and travel.",
    features: [
      "Double-wall vacuum insulation",
      "Durable stainless steel",
      "Secure, leak-resistant lid with loop",
      "Easy-carry loop for workouts and daily activities",
      "Easy to clean",
    ],
    collection: "hydration",
    collectionName: "Bottles & Hydration",
    price: 22.99,
    image: PRODUCT_IMAGES["insulated-bottle"],
    gallery: [PRODUCT_IMAGES["insulated-bottle"]],
    sizes: null,
    isNew: false,
    isFeatured: false,
  },
  {
    slug: "grip-force-kettlebell",
    name: "Grip Force Kettlebell — Power, Control, Full-Body Training",
    description:
      "One compact kettlebell for swings, squats, conditioning and full-body power. The durable cast-iron-style build and comfortable handle grip take you from home workouts to serious strength sessions.",
    features: [
      "Durable cast-iron-style construction",
      "Comfortable, secure handle grip",
      "Full-body exercise: swings, squats, conditioning",
      "Strength & conditioning training",
      "Compact for home & gym use",
    ],
    collection: "strength-training",
    collectionName: "Strength Training",
    price: 54.99,
    image: PRODUCT_IMAGES.kettlebell,
    gallery: [PRODUCT_IMAGES.kettlebell],
    sizes: null,
    isNew: false,
    isFeatured: true,
  },
  {
    slug: "grip-force-resistance-bands-set",
    name: "Grip Force Resistance Bands Set — Full-Body Training Anywhere",
    description:
      "A complete resistance bands set with multiple resistance levels for strength, flexibility and mobility work. Lightweight and portable — an effective full-body workout at home, in the gym, or on the road.",
    features: [
      "Multiple resistance levels",
      "Full-body strength training",
      "Flexibility & mobility support",
      "Lightweight & portable",
      "Warm-ups, strength work and recovery",
    ],
    collection: "resistance-bands",
    collectionName: "Resistance Bands",
    price: 27.99,
    image: PRODUCT_IMAGES["resistance-bands"],
    gallery: [PRODUCT_IMAGES["resistance-bands"]],
    sizes: null,
    isNew: false,
    isFeatured: true,
  },
  {
    slug: "grip-force-dumbbells",
    name: "Grip Force Dumbbells — Build Strength, Train Anywhere",
    description:
      "Hex rubber dumbbells with a durable coating that protects floors and equipment. The comfortable handle grip makes them ideal for home workouts, strength training and every session in between.",
    features: [
      "Durable hex rubber design",
      "Comfortable, secure handle grip",
      "Protects floors and equipment",
      "Home & gym workout essentials",
      "Ideal for curls, presses and full-body routines",
    ],
    collection: "strength-training",
    collectionName: "Strength Training",
    price: 39.99,
    image: PRODUCT_IMAGES.dumbbells,
    gallery: [PRODUCT_IMAGES.dumbbells],
    sizes: null,
    isNew: false,
    isFeatured: true,
  },
  {
    slug: "grip-force-foam-roller",
    name: "Grip Force Foam Roller — Roll. Recover. Move Better.",
    description:
      "A raised-texture foam roller that releases muscles for targeted relief and better mobility. Durable foam construction stands up to daily stretching, warm-ups and post-workout recovery routines.",
    features: [
      "Raised, textured surface for deeper relief",
      "Muscle recovery & flexibility",
      "Durable foam, holds shape with frequent use",
      "Full-body use: legs, back and more",
      "Great before and after workouts",
    ],
    collection: "recovery-mobility",
    collectionName: "Recovery & Mobility",
    price: 21.99,
    image: PRODUCT_IMAGES["foam-roller"],
    gallery: [PRODUCT_IMAGES["foam-roller"]],
    sizes: null,
    isNew: false,
    isFeatured: false,
  },
  {
    slug: "grip-force-speed-jump-rope",
    name: "Grip Force Speed Jump Rope — Skip Faster, Move Stronger",
    description:
      "A fast, adjustable jump rope built for cardio conditioning, speed and agility. Smooth-spinning ergonomic handles and a lightweight cable make it easy to train anywhere — home, gym or travel.",
    features: [
      "Cardio conditioning & endurance",
      "Speed and agility training",
      "Adjustable cable length",
      "Smooth, ergonomic handles",
      "Compact & portable",
    ],
    collection: "home-workout",
    collectionName: "Home Workout",
    price: 14.99,
    image: PRODUCT_IMAGES["jump-rope"],
    gallery: [PRODUCT_IMAGES["jump-rope"]],
    sizes: null,
    isNew: false,
    isFeatured: true,
  },
  {
    slug: "grip-force-exercise-mat",
    name: "Grip Force Exercise Mat — Comfort, Stability, Every Workout",
    description:
      "A non-slip exercise mat with impact-absorbing cushioning that protects your joints and floors. Flexible yet supportive, easy to roll and store — your space for home workouts, stretching and core training.",
    features: [
      "Non-slip textured surface",
      "Impact-absorbing cushioning",
      "Flexible comfort that holds its shape",
      "Easy to roll, easy to store",
      "Home & gym exercise space",
    ],
    collection: "home-workout",
    collectionName: "Home Workout",
    price: 25.99,
    image: PRODUCT_IMAGES["exercise-mat"],
    gallery: [PRODUCT_IMAGES["exercise-mat"]],
    sizes: null,
    isNew: false,
    isFeatured: false,
  },
  {
    slug: "grip-force-protein-shaker",
    name: "Grip Force Protein Shaker Bottle — Shake, Sip, Stay Ready",
    description:
      "Mix smooth shakes anywhere with a secure-lid shaker bottle that won't leak in your gym bag. Easy-mix design, practical capacity and easy-to-clean construction for gym, work and travel.",
    features: [
      "Secure, leak-resistant lid",
      "Easy mixing with a blendable design",
      "Practical everyday capacity",
      "Easy to clean, odor-resistant",
      "Portable — gym, work and travel",
    ],
    collection: "hydration",
    collectionName: "Bottles & Hydration",
    price: 13.99,
    image: PRODUCT_IMAGES["shaker-bottle"],
    gallery: [PRODUCT_IMAGES["shaker-bottle"]],
    sizes: null,
    isNew: false,
    isFeatured: false,
  },
  {
    slug: "grip-force-wrist-wraps",
    name: "Grip Force Weightlifting Wrist Wraps — Support Your Lifting Routine",
    description:
      "Durable, adjustable wrist wraps that stabilize your wrists through presses, cleans and heavy sets. Secure fastening keeps the fit consistent set after set — lift with focus and confidence.",
    features: [
      "Adjustable fit for a secure feel",
      "Durable, reinforced fabric",
      "Secure fastening that stays put",
      "Wrist support during heavy lifts",
      "Machine washable",
    ],
    collection: "strength-training",
    collectionName: "Strength Training",
    price: 17.99,
    image: PRODUCT_IMAGES["wrist-wraps"],
    gallery: [PRODUCT_IMAGES["wrist-wraps"]],
    sizes: null,
    isNew: false,
    isFeatured: false,
  },
  {
    slug: "grip-force-lifting-straps",
    name: "Grip Force Lifting Straps — Better Grip, Heavier Lifts",
    description:
      "Heavy-duty lifting straps with a secure loop design and neoprene padding that takes the strain off your grip during deadlifts, rows, shrugs and heavy pulls. Grip stronger. Lift with confidence.",
    features: [
      "Heavy-duty material",
      "Secure loop design for wrist attachment",
      "Neoprene padding reduces strain",
      "Reinforced stitching for heavy lifts",
      "Easy bar wrap",
    ],
    collection: "strength-training",
    collectionName: "Strength Training",
    price: 14.99,
    image: PRODUCT_IMAGES["lifting-straps"],
    gallery: [PRODUCT_IMAGES["lifting-straps"]],
    sizes: null,
    isNew: false,
    isFeatured: false,
  },
  {
    slug: "grip-force-gym-duffel-bag",
    name: "Grip Force Gym Duffel Bag — Carry Your Gear, Own Your Workout",
    description:
      "A spacious, durable duffel with a dedicated shoe compartment, adjustable shoulder strap and multiple pockets for smaller items. Pack everything you need — gym essentials, clothes, towels and gear.",
    features: [
      "Spacious main compartment",
      "Durable, reinforced construction",
      "Separate shoe compartment",
      "Adjustable shoulder strap",
      "Multiple pockets for smaller items",
    ],
    collection: "gym-bags",
    collectionName: "Gym Bags",
    price: 44.99,
    image: PRODUCT_IMAGES["duffel-bag"],
    gallery: [PRODUCT_IMAGES["duffel-bag"]],
    sizes: null,
    isNew: false,
    isFeatured: true,
  },
  {
    slug: "grip-force-ab-roller",
    name: "Grip Force Ab Roller — Roll Strong, Build Your Core",
    description:
      "An ab roller with dual exercise wheels and ergonomic grips for controlled, stable core workouts. Durable construction holds up through knee tuck rollouts and strength training at home or in the gym.",
    features: [
      "Dual exercise wheels for stability",
      "Ergonomic, comfortable grips",
      "Durable, stable construction",
      "Targets abs and core",
      "Home gym & strength training",
    ],
    collection: "home-workout",
    collectionName: "Home Workout",
    price: 23.99,
    image: PRODUCT_IMAGES["ab-roller-1"],
    gallery: [PRODUCT_IMAGES["ab-roller-1"], PRODUCT_IMAGES["ab-roller-2"]],
    sizes: null,
    isNew: false,
    isFeatured: false,
  },
  {
    slug: "grip-force-gym-gloves",
    name: "Grip Force Gym Gloves — Premium Fitness Gear",
    description:
      "Training gloves with enhanced grip and palm padding that protect your hands through every set. Breathable mesh, adjustable closure and reliable wrist support for weightlifting and daily workouts.",
    features: [
      "Enhanced grip & palm padding",
      "Breathable, washable mesh",
      "Adjustable wrist closure",
      "Reliable wrist support",
      "Easy to clean",
    ],
    collection: "gym-gloves",
    collectionName: "Gym Gloves",
    price: 18.99,
    image: PRODUCT_IMAGES["gym-gloves"],
    gallery: [PRODUCT_IMAGES["gym-gloves"]],
    sizes: ["S", "M", "L", "XL"],
    isNew: false,
    isFeatured: true,
  },
  {
    slug: "grip-force-starter-kit",
    name: "Grip Force Home Starter Kit",
    description:
      "Everything you need to start training at home in one kit: Push-Up Bars for your upper body, the Resistance Bands Set for full-body work, the Speed Jump Rope for cardio and the Exercise Mat as your training base. A complete home gym — bundled at a better price than buying separately.",
    features: [
      "Push-Up Bars for chest, arms and shoulders",
      "Resistance Bands Set with multiple levels",
      "Speed Jump Rope for cardio conditioning",
      "Exercise Mat with non-slip cushioning",
      "Bundle price — cheaper than buying separately",
    ],
    collection: "bundles",
    collectionName: "Bundles & Offers",
    price: 64.99,
    image: PRODUCT_IMAGES["starter-kit"],
    gallery: [PRODUCT_IMAGES["starter-kit"]],
    sizes: null,
    isNew: true,
    isFeatured: true,
  },
];
