export interface MetaDataInterface {
  name: string;
  description: string;
  image: string;
  attributes: [
    { trait_type: string; value: string },
    { trait_type: string; value: string },
    { trait_type: string; value: string }
  ];
}
