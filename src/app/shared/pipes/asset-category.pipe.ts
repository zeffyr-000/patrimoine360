import { Pipe, PipeTransform } from '@angular/core';
import { AssetCategory, AssetType, getAssetCategory } from '../../models/asset.model';

// Transforms an asset type string into its full AssetCategory metadata
@Pipe({ name: 'assetCategory', pure: true })
export class AssetCategoryPipe implements PipeTransform {
  transform(type: AssetType): AssetCategory {
    return getAssetCategory(type);
  }
}
