#ifndef GUARD_GRIEF_INVENTORY
#define GUARD_GRIEF_INVENTORY

#include <vector>

namespace grief {
	enum InventoryType
		{ INVENTORY_MAIN = -1
		, INVENTORY_EQUIP = -2
		, INVENTORY_CRAFT = -3
		};

	enum ItemType 
		{ ITEM_NONE = -1
		};

	struct Item {
		ItemType id;
		char count;
		short health;
	};

	struct Inventory {
		typedef std::vector<Item> ItemList;

		InventoryType type;
		ItemList items;
	};

};

#endif
