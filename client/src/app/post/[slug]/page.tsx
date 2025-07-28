"use client"
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getPostBySlug } from '@/redux/slices/postSlice'
import { useParams } from 'next/navigation'

const PostBySlug = () => {

  const dispatch = useAppDispatch();
  const params = useParams();

  const {getSlugPost} = useAppSelector((state) => state.post);

  const slug = params.slug as string;

  useEffect(() => {
    dispatch(getPostBySlug(slug));
  }, [dispatch, slug]);

  return (
    <div>
      <h1>{getSlugPost?.title}</h1>
    </div>
  )
}

export default PostBySlug