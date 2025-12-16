#!/bin/bash

# Daily Methods Hub - Setup Script

echo "🚀 Setting up Daily Methods Hub..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18.x or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from example..."
    cp .env.local.example .env.local
    echo "✅ .env.local created"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "  1. Review and update .env.local if needed"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Open http://localhost:3000 in your browser"
echo ""
echo "📖 Documentation:"
echo "  - README.md - Project overview"
echo "  - STRUCTURE.md - Project structure"
echo "  - DEVELOPMENT.md - Development guide"
echo ""
echo "Happy coding! 🎉"
