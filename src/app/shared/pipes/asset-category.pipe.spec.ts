import { describe, it, expect } from 'vitest';
import { AssetCategoryPipe } from './asset-category.pipe';
import { ASSET_CATEGORIES, AssetType } from '../../models/asset.model';

describe('AssetCategoryPipe', () => {
  const pipe = new AssetCategoryPipe();

  it('should return the correct category for each known type', () => {
    for (const expected of ASSET_CATEGORIES) {
      const result = pipe.transform(expected.type);
      expect(result.type).toBe(expected.type);
      expect(result.label).toBe(expected.label);
      expect(result.icon).toBe(expected.icon);
      expect(result.color).toBe(expected.color);
    }
  });

  it('should return "Autres" fallback for unknown types', () => {
    const result = pipe.transform('unknown_type' as unknown as AssetType);
    expect(result.label).toBe('Autres');
    expect(result.icon).toBe('category');
  });
});
