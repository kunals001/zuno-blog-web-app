"use client"
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getPostBySlug } from '@/redux/slices/postSlice'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/router'

const page = () => {

  const dispatch = useAppDispatch();
  const params = useParams();
  const router = useRouter();

  const {getSlugPost,getSlugLoading,getSlugError} = useAppSelector((state) => state.post);

  const slug = params.slug as string;

  useEffect(() => {
    dispatch(getPostBySlug(slug));
  }, [dispatch, slug]);

  return (
    <div>

    </div>
  )
}

export default page