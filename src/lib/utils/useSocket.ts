/**
 * Socket.IO Hook - NextDeal Frontend
 *
 * This custom hook provides real-time communication functionality using Socket.IO.
 * It manages WebSocket connections for chat, notifications, and live updates
 * throughout the NextDeal application.
 *
 * Features:
 * - Real-time WebSocket connections
 * - Automatic reconnection handling
 * - User authentication with tokens
 * - Event emission and listening
 * - Connection status monitoring
 * - User registration for targeted messaging
 *
 * Usage:
 * const { socket, connected, emit, on, off } = useSocket({ userId, role, token });
 *
 * @param {Object} params - Socket configuration parameters
 * @param {string} params.userId - User ID for socket identification
 * @param {string} params.role - User role for permission-based messaging
 * @param {string} params.token - Authentication token for secure connections
 * @returns {Object} Socket instance and utility functions
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// Socket server URL from environment variables
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;

import { SocketConfig } from '../../types';

export default function useSocket({ userId, role, token }: SocketConfig): {
  socket: Socket | null;
  connected: boolean;
  emit: (event: string, payload: unknown) => void;
  on: (event: string, handler: (data: unknown) => void) => void;
  off: (event: string, handler: (data: unknown) => void) => void;
} {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  // Initialize socket connection when user data is available
  useEffect(() => {
    if (!userId) {
      return;
    }
    // Create socket connection with authentication and configuration
    const socket = io(SOCKET_URL, {
      auth: { token }, // Authentication token
      query: { userId, role }, // User identification and role
      transports: ['websocket'], // Force WebSocket transport
      reconnection: true, // Enable automatic reconnection
      withCredentials: true, // Include cookies in requests
    });
    socketRef.current = socket;
    // Handle connection events
    socket.on('connect', () => {
      setConnected(true);
    });
    socket.on('disconnect', () => {
      setConnected(false);
    });
    socket.on('connect_error', () => {
      setConnected(false);
    });
    socket.on('reconnect', () => {
      setConnected(true);
    });
    socket.on('reconnect_error', () => {
    });
    socket.on('reconnect_failed', () => {
      setConnected(false);
    });

    // Cleanup socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, [userId, role, token]);

  // Register user with socket server when connected
  useEffect(() => {
    if (!userId || !socketRef.current) return;

    socketRef.current.emit('register_user', { userId });
  }, [connected, userId]);

  /**
     * Emit an event to the socket server
     * @param {string} event - Event name to emit
     * @param {unknown} payload - Data to send with the event
     */
  const emit = useCallback((event: string, payload: unknown): void => {
    if (!socketRef.current) {
      return;
    }
    if (!connected) {
      // console.log('not connected');
    }
    socketRef.current.emit(event, payload);
  }, [connected]);

  /**
     * Listen for events from the socket server
     * @param {string} event - Event name to listen for
     * @param {Function} handler - Event handler function
     */
  const on = useCallback((event: string, handler: (data: unknown) => void): void => {
    socketRef.current?.on(event, handler);
  }, []);

  /**
     * Remove event listener
     * @param {string} event - Event name to stop listening for
     * @param {Function} handler - Event handler function to remove
     */
  const off = useCallback((event: string, handler: (data: unknown) => void): void => {
    socketRef.current?.off(event, handler);
  }, []);

  return { socket: socketRef.current, connected, emit, on, off };
}

