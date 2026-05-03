import { connectDB } from '@/lib/db';
import MenuItem from '@/lib/models/MenuItem';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query: any = {};
    if (category) {
      query.category = category;
    }

    const items = await MenuItem.find(query).sort({ category: 1, name: 1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Get menu items error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const { emoji, name, description, price, category, isVegetarian } = body;

    if (!emoji || !name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const item = new MenuItem({
      emoji,
      name,
      description,
      price: Number(price),
      category,
      isVegetarian: isVegetarian || false,
    });

    await item.save();
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Create menu item error:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}
