INSERT INTO public.account(
        account_fisrtname,
        account_lastname,
        account_email,
        account_password
    )
VALUES(
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
UPDATE public.account
SET account_type = 'Admin'
WHERE account_fisrtname = 'Tony';
DELETE FROM public.account
WHERE account_fisrtname = 'Tony';
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM';
SELECT inv_make,
    inv_model,
    classification_name
FROM public.inventory AS inv
    INNER JOIN public.classification AS classic ON inv.classification_id = classic.classification_id
    AND classification_name = 'Sport';
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles/');