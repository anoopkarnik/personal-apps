import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID,
    process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_YOUTUBE_REDIRECT_URI
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  'https://www.googleapis.com/auth/blogger',
  'https://www.googleapis.com/auth/calendar'
];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes
});