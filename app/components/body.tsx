"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "./modal";
import Details from "./details";
import { useProfiles } from "@/context/ProfilesContext";


export default function Body() {

    const [photos, setPhotos] = useState<string[]>([]);
    const { profiles, setProfiles } = useProfiles();



    const [selectedprofile, setSelectedprofile] = useState<any>(profiles[0]);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const get_profiles = async () => {
        try {
            const response = await fetch("http://localhost/api/profiles", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to get profiles");
            }

            const result = await response.json();
            const data = result.data;

            const initialProfiles: ProfileModel[] = data.map((profile_object: any) => ({
                id: profile_object.id,
                name: profile_object.name,
                craft: profile_object.craft,
                location: profile_object.location,
                website: profile_object.website,
                instagram: profile_object.instagram,
                bio: profile_object.bio,
                experience: profile_object.experience,
                skills: profile_object.skills,
                photos: [],
            }));

            setProfiles(initialProfiles);

            initialProfiles.forEach((profile) => {
                load_profile_photos(profile.id);
            });

            console.log("Profiles fetched successfully.");
        } catch (error) {
            console.error("Error occurred in get_profiles: ", error);
        }
    };


    const load_profile_photos = async (profileId: string) => {
        try {
            const response = await fetch(`http://localhost/api/profile-photos/${profileId}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to get profile photos");
            }

            const result = await response.json();
            const photoUrls = result.data;

            const photoObjectUrls: string[] = await Promise.all(
                photoUrls.map(async (url: string) => {
                    const response = await fetch(url, {
                        method: "GET",
                    });

                    if (!response.ok) {
                        throw new Error("Failed to get profile photo");
                    }

                    const photoBlob = await response.blob();
                    const photoObjectUrl = URL.createObjectURL(photoBlob);
                    return photoObjectUrl;
                })
            );

            setProfiles((prevProfiles: ProfileModel[]) =>
                prevProfiles.map((profile: ProfileModel) => {
                    if (profile.id === profileId) {
                        return {
                            ...profile,
                            photos: photoObjectUrls,
                        };
                    }
                    return profile;
                })
            );
        } catch (error) {
            console.error(`Error occurred while fetching photos for profile ${profileId}:`, error);
        }
    };

    useEffect(() => {
        get_profiles();

    }, [])

    return (
        <main className="flex-grow">
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {profiles.length > 0 && profiles.map((profile, index) => (
                            <Card
                                key={index}
                                className="overflow-hidden cursor-pointer"
                                onClick={() => {
                                    setSelectedprofile(profile);
                                    setIsDetailsModalOpen(true);
                                }}
                            >
                                <img
                                    src={profile.photos[0]}
                                    alt={`${profile.name}'s ${profile.craft}`}
                                    className="w-full h-48 object-cover"
                                />
                                <CardContent className="p-4">
                                    <h3 className="font-semibold mb-2">{profile.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {profile.craft}
                                    </p>
                                    {/* <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                    <span className="font-semibold mr-2">
                                        {profile.rating}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        ({profile.reviews} reviews)
                                    </span>
                                </div> */}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            {selectedprofile &&
                <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)}>
                    <Details
                        onClose={() => setIsDetailsModalOpen(false)}
                        name={selectedprofile.name}
                        craft={selectedprofile.craft}
                        location={selectedprofile.location}
                        website={selectedprofile.website}
                        instagram={selectedprofile.instagram}
                        skills={selectedprofile.skills}
                        bio={selectedprofile.bio}
                        experience={selectedprofile.experience}
                        photos={selectedprofile.photos}
                    />
                </Modal>}
        </main>
    );
}