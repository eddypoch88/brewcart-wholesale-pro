'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import React, { useState } from 'react';

// Next.js Image is optional in Vite, using standard <img> is safer unless configured
// But since this project uses Vite + React, we should stick to standard <img> unless 'next/image' is explicitly supported (unlikely in pure Vite)
// The user provided code uses 'next/image', but this is a Vite project. I will adapt to use <img>.

interface MediaItem {
    type: 'image' | 'video';
    src: string;
    poster?: string; // Gambar depan untuk video
}

export default function MediaCarousel({ media }: { media: MediaItem[] }) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="relative w-full aspect-[4/5] bg-black"> {/* Aspect Ratio 4:5 (Shopee Standard) */}

            <Swiper
                modules={[Pagination]}
                pagination={{ clickable: true }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                className="h-full w-full"
            >
                {media.map((item, index) => (
                    <SwiperSlide key={index} className="flex items-center justify-center bg-gray-100">
                        {item.type === 'video' ? (
                            <video
                                src={item.src}
                                poster={item.poster}
                                controls
                                className="w-full h-full object-cover"
                                playsInline // PENTING: Supaya tak full screen d iPhone
                            />
                        ) : (
                            <div className="relative w-full h-full">
                                <img
                                    src={item.src}
                                    alt={`Product ${index}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Indicator Nombor (Macam Shopee: 1/5) */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-10">
                {activeIndex + 1} / {media.length}
            </div>

        </div>
    );
}
