import { sendError } from '../lib/errors.js';
import { toShortUrl } from '../lib/public-url.js';
import * as urlService from '../services/url.service.js';

export async function shortenUrl(req, res) {
  try {
    const { url, created } = await urlService.createShortUrl(req.body?.link);
    console.log({ url, created });
    return res.status(created ? 201 : 200).json({
      link: url.original,
      short: url.short,
      shortUrl: toShortUrl(url.short, req),
    });
  } catch (err) {
    console.log(err);
    return sendError(res, err, 'Failed to shorten URL');
  }
}

export async function redirectUrl(req, res) {
  try {
    const row = await urlService.resolveShort(req.params.code);
    return res.redirect(302, row.original);
  } catch (err) {
    return sendError(res, err, 'Failed to resolve short URL');
  }
}
