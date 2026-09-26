import {
  Category, Warehouse, Product, Receipt, Delivery,
  InternalTransfer, StockAdjustment, StockLedgerEntry, DashboardSummary
} from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: "Electronics & Sensors", description: "Precision IoT and microcontroller boards" },
  { id: 2, name: "Packaging & Storage", description: "Industrial containers, boxes, and tapes" },
  { id: 3, name: "Hardware & Tools", description: "Assembly tools and measurement devices" },
  { id: 4, name: "Safety & PPE", description: "Protective equipment for warehouse staff" }
];

export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 1,
    name: "Central Logistics Hub",
    code: "WH-CENTRAL",
    address: "100 Enterprise Way, Hub 1",
    is_active: true,
    locations: [
      { id: 1, warehouse_id: 1, name: "Rack A - High Velocity", code: "WH-C-RACK-A", is_active: true, warehouse_name: "Central Logistics Hub" },
      { id: 2, warehouse_id: 1, name: "Receiving Dock Staging", code: "WH-C-DOCK-1", is_active: true, warehouse_name: "Central Logistics Hub" },
      { id: 3, warehouse_id: 1, name: "Cold Storage Bay", code: "WH-C-COLD", is_active: true, warehouse_name: "Central Logistics Hub" },
    ]
  },
  {
    id: 2,
    name: "North Distribution Depot",
    code: "WH-NORTH",
    address: "45 Commerce Blvd",
    is_active: true,
    locations: [
      { id: 4, warehouse_id: 2, name: "Depot Bay 01", code: "WH-N-BAY-01", is_active: true, warehouse_name: "North Distribution Depot" },
      { id: 5, warehouse_id: 2, name: "Overflow Mezzanine", code: "WH-N-MEZZ", is_active: true, warehouse_name: "North Distribution Depot" }
    ]
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Smart RFID Scanner Wand",
    sku: "SS-WAND-001",
    category_id: 1,
    category_name: "Electronics & Sensors",
    uom: "Units",
    unit_price: 185.00,
    initial_stock: 45,
    min_stock_alert: 15,
    reorder_quantity: 30,
    description: "Long-range wireless barcode and RFID inventory scanner",
    total_stock: 45,
    stock_status: "IN_STOCK",
    created_at: "2026-03-01T08:00:00Z",
    updated_at: "2026-03-10T14:30:00Z",
    stock_levels: [
      { id: 1, location_id: 1, location_code: "WH-C-RACK-A", location_name: "Rack A - High Velocity", warehouse_name: "Central Logistics Hub", quantity_on_hand: 35, reserved_quantity: 0 },
      { id: 2, location_id: 4, location_code: "WH-N-BAY-01", location_name: "Depot Bay 01", warehouse_name: "North Distribution Depot", quantity_on_hand: 10, reserved_quantity: 0 }
    ]
  },
  {
    id: 2,
    name: "Thermal Label Roll (4x6)",
    sku: "SS-LBL-4X6",
    category_id: 2,
    category_name: "Packaging & Storage",
    uom: "Rolls",
    unit_price: 12.50,
    initial_stock: 8,
    min_stock_alert: 25,
    reorder_quantity: 100,
    description: "Direct thermal shipping label rolls (500 labels/roll)",
    total_stock: 8,
    stock_status: "LOW_STOCK",
    created_at: "2026-03-02T09:15:00Z",
    updated_at: "2026-03-11T11:20:00Z",
    stock_levels: [
      { id: 3, location_id: 1, location_code: "WH-C-RACK-A", location_name: "Rack A - High Velocity", warehouse_name: "Central Logistics Hub", quantity_on_hand: 8, reserved_quantity: 0 }
    ]
  },
  {
    id: 3,
    name: "Heavy Duty Storage Bin (60L)",
    sku: "SS-BIN-60L",
    category_id: 2,
    category_name: "Packaging & Storage",
    uom: "Units",
    unit_price: 24.00,
    initial_stock: 0,
    min_stock_alert: 10,
    reorder_quantity: 50,
    description: "Stackable impact-resistant polypropylene container",
    total_stock: 0,
    stock_status: "OUT_OF_STOCK",
    created_at: "2026-03-03T10:00:00Z",
    updated_at: "2026-03-12T09:45:00Z",
    stock_levels: [
      { id: 4, location_id: 2, location_code: "WH-C-DOCK-1", location_name: "Receiving Dock Staging", warehouse_name: "Central Logistics Hub", quantity_on_hand: 0, reserved_quantity: 0 }
    ]
  },
  {
    id: 4,
    name: "Precision Caliper Digital 150mm",
    sku: "SS-CALIPER-150",
    category_id: 3,
    category_name: "Hardware & Tools",
    uom: "Units",
    unit_price: 45.00,
    initial_stock: 32,
    min_stock_alert: 5,
    reorder_quantity: 20,
    description: "Stainless steel digital caliper with LCD screen",
    total_stock: 32,
    stock_status: "IN_STOCK",
    created_at: "2026-03-04T11:30:00Z",
    updated_at: "2026-03-12T16:10:00Z",
    stock_levels: [
      { id: 5, location_id: 4, location_code: "WH-N-BAY-01", location_name: "Depot Bay 01", warehouse_name: "North Distribution Depot", quantity_on_hand: 32, reserved_quantity: 0 }
    ]
  },
  {
    id: 5,
    name: "Kevlar Grip Work Gloves (Size L)",
    sku: "SS-GLV-KEV-L",
    category_id: 4,
    category_name: "Safety & PPE",
    uom: "Pairs",
    unit_price: 18.00,
    initial_stock: 6,
    min_stock_alert: 15,
    reorder_quantity: 40,
    description: "Level 5 cut resistant polyurethane dipped palm gloves",
    total_stock: 6,
    stock_status: "LOW_STOCK",
    created_at: "2026-03-05T14:00:00Z",
    updated_at: "2026-03-14T10:15:00Z",
    stock_levels: [
      { id: 6, location_id: 1, location_code: "WH-C-RACK-A", location_name: "Rack A - High Velocity", warehouse_name: "Central Logistics Hub", quantity_on_hand: 6, reserved_quantity: 0 }
    ]
  }
];

export const INITIAL_RECEIPTS: Receipt[] = [
  {
    id: 1,
    receipt_number: "REC-2026-0001",
    supplier_name: "Acrobat Supply Chain Ltd",
    status: "DRAFT",
    receipt_date: "2026-03-24T10:00:00Z",
    notes: "Restock for Q1 high runner packaging",
    created_at: "2026-03-24T10:00:00Z",
    items: [
      { id: 1, product_id: 2, product_name: "Thermal Label Roll (4x6)", product_sku: "SS-LBL-4X6", location_id: 1, location_name: "Rack A - High Velocity", quantity: 50, unit_cost: 11.20 },
      { id: 2, product_id: 3, product_name: "Heavy Duty Storage Bin (60L)", product_sku: "SS-BIN-60L", location_id: 2, location_name: "Receiving Dock Staging", quantity: 30, unit_cost: 21.50 }
    ]
  },
  {
    id: 2,
    receipt_number: "REC-2026-0002",
    supplier_name: "Apex Electronics Global",
    status: "VALIDATED",
    receipt_date: "2026-03-20T14:30:00Z",
    notes: "RFID equipment shipment verified and stored",
    created_at: "2026-03-20T11:00:00Z",
    validated_at: "2026-03-20T15:00:00Z",
    items: [
      { id: 3, product_id: 1, product_name: "Smart RFID Scanner Wand", product_sku: "SS-WAND-001", location_id: 1, location_name: "Rack A - High Velocity", quantity: 20, unit_cost: 165.00 }
    ]
  }
];

export const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: 1,
    delivery_number: "DEL-2026-0001",
    customer_name: "OmniTech Solutions Corp",
    status: "PICKING",
    delivery_date: "2026-03-25T16:00:00Z",
    shipping_address: "742 Innovation Way, Silicon Valley, CA",
    notes: "Expedited courier delivery required",
    created_at: "2026-03-25T09:00:00Z",
    items: [
      { id: 1, product_id: 1, product_name: "Smart RFID Scanner Wand", product_sku: "SS-WAND-001", location_id: 1, location_name: "Rack A - High Velocity", quantity: 5 }
    ]
  },
  {
    id: 2,
    delivery_number: "DEL-2026-0002",
    customer_name: "Northwest Auto Mechanics",
    status: "VALIDATED",
    delivery_date: "2026-03-22T13:00:00Z",
    shipping_address: "12 Industrial Road, Seattle, WA",
    notes: "Delivered and signature obtained",
    created_at: "2026-03-22T08:30:00Z",
    validated_at: "2026-03-22T14:00:00Z",
    items: [
      { id: 2, product_id: 4, product_name: "Precision Caliper Digital 150mm", product_sku: "SS-CALIPER-150", location_id: 4, location_name: "Depot Bay 01", quantity: 4 }
    ]
  }
];

export const INITIAL_TRANSFERS: InternalTransfer[] = [
  {
    id: 1,
    transfer_number: "TRF-2026-0001",
    source_location_id: 1,
    source_location_name: "Rack A - High Velocity (Central Hub)",
    dest_location_id: 4,
    dest_location_name: "Depot Bay 01 (North Depot)",
    status: "SCHEDULED",
    scheduled_date: "2026-03-27T08:00:00Z",
    notes: "Inter-facility balance for Northern regional sales",
    created_at: "2026-03-25T11:00:00Z",
    items: [
      { id: 1, product_id: 1, product_name: "Smart RFID Scanner Wand", product_sku: "SS-WAND-001", quantity: 5 }
    ]
  }
];

export const INITIAL_ADJUSTMENTS: StockAdjustment[] = [
  {
    id: 1,
    adjustment_number: "ADJ-2026-0001",
    product_id: 2,
    product_name: "Thermal Label Roll (4x6)",
    product_sku: "SS-LBL-4X6",
    location_id: 1,
    location_name: "Rack A - High Velocity",
    recorded_qty: 10,
    counted_qty: 8,
    diff_qty: -2,
    reason: "Damaged in transit",
    notes: "Water damage on bottom row",
    adjusted_by: "Alex Morgan",
    created_at: "2026-03-21T16:20:00Z"
  }
];

export const INITIAL_LEDGER: StockLedgerEntry[] = [
  {
    id: 1,
    timestamp: "2026-03-22T14:00:00Z",
    product_id: 4,
    product_name: "Precision Caliper Digital 150mm",
    product_sku: "SS-CALIPER-150",
    location_id: 4,
    location_name: "Depot Bay 01",
    warehouse_name: "North Distribution Depot",
    change_qty: -4,
    balance_after: 32,
    action_type: "DELIVERY",
    reference_doc_type: "Delivery",
    reference_doc_number: "DEL-2026-0002",
    user_email: "admin@stocksense.io",
    notes: "Delivery dispatched to Northwest Auto Mechanics"
  },
  {
    id: 2,
    timestamp: "2026-03-21T16:20:00Z",
    product_id: 2,
    product_name: "Thermal Label Roll (4x6)",
    product_sku: "SS-LBL-4X6",
    location_id: 1,
    location_name: "Rack A - High Velocity",
    warehouse_name: "Central Logistics Hub",
    change_qty: -2,
    balance_after: 8,
    action_type: "ADJUSTMENT",
    reference_doc_type: "Adjustment",
    reference_doc_number: "ADJ-2026-0001",
    user_email: "admin@stocksense.io",
    notes: "Stock adjusted (Damaged in transit). Physical Count: 8, Recorded: 10"
  },
  {
    id: 3,
    timestamp: "2026-03-20T15:00:00Z",
    product_id: 1,
    product_name: "Smart RFID Scanner Wand",
    product_sku: "SS-WAND-001",
    location_id: 1,
    location_name: "Rack A - High Velocity",
    warehouse_name: "Central Logistics Hub",
    change_qty: 20,
    balance_after: 45,
    action_type: "RECEIPT",
    reference_doc_type: "Receipt",
    reference_doc_number: "REC-2026-0002",
    user_email: "admin@stocksense.io",
    notes: "Receipt validated from Apex Electronics Global"
  }
];

export const getMockDashboardSummary = (): DashboardSummary => {
  const totalProducts = INITIAL_PRODUCTS.length;
  const totalUnits = INITIAL_PRODUCTS.reduce((acc, p) => acc + p.total_stock, 0);
  const lowStock = INITIAL_PRODUCTS.filter(p => p.stock_status === 'LOW_STOCK');
  const outOfStock = INITIAL_PRODUCTS.filter(p => p.stock_status === 'OUT_OF_STOCK');

  return {
    kpis: {
      total_products: totalProducts,
      total_units_in_stock: totalUnits,
      low_stock_count: lowStock.length,
      out_of_stock_count: outOfStock.length,
      pending_receipts: INITIAL_RECEIPTS.filter(r => r.status === 'DRAFT').length,
      pending_deliveries: INITIAL_DELIVERIES.filter(d => ['DRAFT', 'PICKING', 'PACKING'].includes(d.status)).length,
      scheduled_transfers: INITIAL_TRANSFERS.filter(t => t.status === 'SCHEDULED').length
    },
    low_stock_items: [...lowStock, ...outOfStock],
    category_distribution: INITIAL_CATEGORIES.map(c => {
      const prods = INITIAL_PRODUCTS.filter(p => p.category_id === c.id);
      return {
        category_name: c.name,
        product_count: prods.length,
        total_quantity: prods.reduce((sum, p) => sum + p.total_stock, 0)
      };
    }),
    recent_movements: INITIAL_LEDGER
  };
};
