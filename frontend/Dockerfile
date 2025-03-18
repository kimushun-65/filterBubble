# ベースイメージ
FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /app

# Alpine Linux に不足しているビルドに必要なパッケージをインストール
RUN apk add --no-cache python3 make g++

# package.json と package-lock.json をコピー
COPY package*.json ./

# 開発環境を指定
#   - devDependencies も含めてインストールするために NODE_ENV=development にする
#   - Next.js Telemetry を無効化
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# 依存関係をインストール（devDependencies も含む）
RUN npm install

# ソースコードをすべてコピー
COPY . .

# MSW の Service Worker を生成
RUN npx msw init public/ --save

# 開発用なので build はしない。
# もし必要であれば、ここで npm run build を実行。

# ポートを解放
EXPOSE 3000

# コンテナ起動時に npm run dev で起動
CMD ["npm", "run", "dev"]