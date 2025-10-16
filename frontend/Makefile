check:
	npx prettier --check .
	npx eslint . --ext .js,.jsx,.ts,.tsx
	npx tsc --noEmit
	npm run test

fix:
	npx prettier --write .
	npx eslint . --ext .js,.jsx,.ts,.tsx --fix

pre-commit:
	npx lint-staged
