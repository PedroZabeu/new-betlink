import { ChannelCard } from '@/lib/types/channel';

interface ComparisonResult {
  field: string;
  mock: any;
  db: any;
  isMatched: boolean;
}

interface ChannelComparison {
  channelName: string;
  isFullySync: boolean;
  syncPercentage: number;
  differences: ComparisonResult[];
  totalFields: number;
}

export function compareChannelData(mockChannel: ChannelCard, dbChannel: any): ChannelComparison {
  const differences: ComparisonResult[] = [];
  
  // Handle case where channel is not found
  if (!dbChannel) {
    return {
      channelName: mockChannel.name,
      isFullySync: false,
      syncPercentage: 0,
      differences: [{
        field: 'channel',
        mock: 'exists',
        db: 'not found',
        isMatched: false
      }],
      totalFields: 1
    };
  }
  
  const fieldsToCompare = [
    { field: 'name', mock: mockChannel.name, db: dbChannel.name },
    { field: 'description', mock: mockChannel.description, db: dbChannel.description },
    { field: 'is_premium', mock: mockChannel.isPremium, db: dbChannel.is_premium },
    { field: 'avatar', mock: mockChannel.avatar, db: dbChannel.avatar },
    { field: 'subscribers_count', mock: mockChannel.subscribers, db: dbChannel.subscribers_count },
    { field: 'max_subscribers', mock: mockChannel.maxSubscribers, db: dbChannel.max_subscribers },
    { field: 'base_price', mock: Math.round(mockChannel.price * 100), db: dbChannel.base_price },
    // Add new fields after Cursor adds them
    { field: 'tipster_name', mock: mockChannel.tipster, db: dbChannel.tipster_name },
    { field: 'total_tips', mock: mockChannel.totalTips, db: dbChannel.total_tips },
  ];

  // Compare basic fields
  fieldsToCompare.forEach(({ field, mock, db }) => {
    const isMatched = mock === db;
    differences.push({ field, mock, db, isMatched });
  });

  // Compare tags
  if (dbChannel.channel_tags && dbChannel.channel_tags[0]) {
    const dbTag = dbChannel.channel_tags[0];
    const tagComparisons = [
      { field: 'sport', mock: mockChannel.tags.sport, db: dbTag.sport },
      { field: 'bookmaker', mock: mockChannel.tags.bookmaker, db: dbTag.bookmaker },
      { field: 'method', mock: mockChannel.tags.method, db: dbTag.method },
      { field: 'market', mock: mockChannel.tags.market, db: dbTag.market },
      { field: 'liquidity', mock: mockChannel.tags.liquidity, db: dbTag.liquidity },
    ];
    
    tagComparisons.forEach(({ field, mock, db }) => {
      const isMatched = mock === db;
      differences.push({ field: `tags.${field}`, mock, db, isMatched });
    });
  }

  const matchedCount = differences.filter(d => d.isMatched).length;
  const totalFields = differences.length;
  
  return {
    channelName: mockChannel.name,
    isFullySync: matchedCount === totalFields,
    syncPercentage: Math.round((matchedCount / totalFields) * 100),
    differences: differences.filter(d => !d.isMatched),
    totalFields
  };
}

export function calculateOverallSync(comparisons: ChannelComparison[]): {
  overallPercentage: number;
  fullySyncedCount: number;
  totalChannels: number;
  totalFields: number;
  matchedFields: number;
} {
  const fullySyncedCount = comparisons.filter(c => c.isFullySync).length;
  const totalChannels = comparisons.length;
  
  let totalFields = 0;
  let matchedFields = 0;
  
  comparisons.forEach(comparison => {
    totalFields += comparison.totalFields;
    matchedFields += Math.round(comparison.totalFields * comparison.syncPercentage / 100);
  });
  
  return {
    overallPercentage: totalFields > 0 ? Math.round((matchedFields / totalFields) * 100) : 0,
    fullySyncedCount,
    totalChannels,
    totalFields,
    matchedFields
  };
}